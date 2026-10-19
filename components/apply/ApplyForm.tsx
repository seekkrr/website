"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFieldArray, useForm, type FieldPath, type FieldValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowLeft, ArrowRight, Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { CollabCard } from "@/components/collabs/CollabCard";
import { trackEvent } from "@/lib/analytics";
import { ApiError } from "@/lib/api";
import { clientState } from "@/lib/clientState";
import {
  formatInr,
  submitBusinessApplication,
  type BusinessApplicationPayload,
  type Plan,
  type PlanCode,
} from "@/lib/collabs";
import { draftFromSearchParams, draftSummary, formatBrief, type CollabDraft } from "@/lib/collabDraft";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";
import { ApplySuccess } from "./ApplySuccess";
import { PlaceSearch } from "./PlaceSearch";
import {
  API_MESSAGE_MAX,
  CATEGORY_OPTIONS,
  DEFAULT_VALUES,
  FIELD_STEP,
  MESSAGE_MAX,
  PLAN_CODES,
  STEPS,
  STEP_SCHEMAS,
  type ApplyFormValues,
  type LocationMode,
} from "./schema";

// ── Draft persistence (localStorage can throw: private mode, blocked storage) ─

const DRAFT_KEY = "seekkrr.businessApply.draft.v1";
const SUBMITTED_KEY = "businessApplicationSubmitted";
const LAST_STEP = STEPS.length - 1;

interface StoredDraft {
  version: 1;
  values: Omit<ApplyFormValues, "agree_terms">;
  step: number;
  collab: CollabDraft | null;
  savedAt: number;
}

function readDraft(): StoredDraft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredDraft>;
    return parsed && parsed.version === 1 && parsed.values ? (parsed as StoredDraft) : null;
  } catch {
    return null;
  }
}

function writeDraft(draft: StoredDraft) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}

const isPlanCode = (v: unknown): v is PlanCode => PLAN_CODES.includes(v as PlanCode);
const asString = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

/** Rebuild form values from untrusted storage, field by field. */
function sanitizeValues(raw: Partial<ApplyFormValues>): ApplyFormValues {
  const links = Array.isArray(raw.social_links)
    ? raw.social_links
        .map((l) => ({ url: asString((l as { url?: unknown })?.url) }))
        .slice(0, 10)
    : DEFAULT_VALUES.social_links;
  return {
    business_name: asString(raw.business_name),
    contact_name: asString(raw.contact_name),
    email: asString(raw.email),
    phone: asString(raw.phone),
    location_mode: raw.location_mode === "maps" ? "maps" : "claim",
    claimed_marker_id: asString(raw.claimed_marker_id),
    claimed_marker_title: asString(raw.claimed_marker_title),
    claimed_marker_address: asString(raw.claimed_marker_address),
    region_id: asString(raw.region_id),
    maps_url: asString(raw.maps_url),
    social_links: links.length ? links : [{ url: "" }],
    categories: Array.isArray(raw.categories)
      ? raw.categories.filter((c): c is string => typeof c === "string").slice(0, 10)
      : [],
    requested_plan: isPlanCode(raw.requested_plan) ? raw.requested_plan : DEFAULT_VALUES.requested_plan,
    gstin: asString(raw.gstin),
    message: asString(raw.message),
    agree_terms: false,
  };
}

interface InitialState {
  values: ApplyFormValues;
  step: number;
  collab: CollabDraft | null;
  savedAt: number | null;
  alreadySubmitted: boolean;
}

function loadInitial(params: URLSearchParams): InitialState {
  const stored = readDraft();
  let values = stored ? sanitizeValues(stored.values) : DEFAULT_VALUES;
  let collab = stored?.collab ?? null;
  const fromBuilder = draftFromSearchParams(params);
  if (fromBuilder) collab = fromBuilder;
  const plan = params.get("plan");
  if (isPlanCode(plan)) values = { ...values, requested_plan: plan };
  const step = stored ? Math.min(Math.max(Math.trunc(Number(stored.step) || 0), 0), LAST_STEP) : 0;
  return {
    values,
    step,
    collab,
    savedAt: stored?.savedAt ?? null,
    alreadySubmitted: clientState.get(SUBMITTED_KEY) === "true",
  };
}

function composeMessage(message: string, collab: CollabDraft | null) {
  const parts = [message.trim(), collab ? draftSummary(collab) : ""].filter(Boolean);
  const text = parts.join("\n\n");
  return text.length > API_MESSAGE_MAX ? `${text.slice(0, API_MESSAGE_MAX - 1)}…` : text;
}

function planPrice(plan: Plan) {
  if (plan.custom || plan.price_monthly_inr === null) return "Custom pricing";
  if (plan.price_monthly_inr === 0) return "Free forever";
  return `${formatInr(plan.price_monthly_inr)}/month + GST`;
}

const STEP_INTROS = [
  "Tell us who you are. We only use these details to verify you and get in touch.",
  "Claim your place if it's already on the SeekKrr map, or send us a Google Maps link.",
  "Your socials help us verify you faster and show creators what you're about.",
  "No payment now. Pick the plan you're leaning towards; you can change it any time.",
  "Check everything looks right, then send it over.",
];

// ── Component ──────────────────────────────────────────────────────────────

interface ApplyFormProps {
  plans: Plan[];
}

export default function ApplyForm({ plans }: ApplyFormProps) {
  const searchParams = useSearchParams();
  const [initial] = useState(() => loadInitial(new URLSearchParams(searchParams.toString())));
  const [step, setStep] = useState(initial.step);
  const [collab, setCollab] = useState<CollabDraft | null>(initial.collab);
  const [savedAt, setSavedAt] = useState<number | null>(initial.savedAt);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ businessName?: string; email?: string; hasCollab?: boolean } | null>(
    initial.alreadySubmitted ? {} : null
  );

  const stepRef = useRef(initial.step);
  const collabRef = useRef<CollabDraft | null>(initial.collab);
  const submittingRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);
  const id = useId();

  // Validate only the current step's fields; the step lives in a ref so the
  // resolver identity stays stable for react-hook-form.
  const resolver = useCallback<Resolver<ApplyFormValues>>((values, context, options) => {
    const schema = STEP_SCHEMAS[stepRef.current] as unknown as z.ZodType<FieldValues, FieldValues>;
    return (zodResolver(schema) as unknown as Resolver<ApplyFormValues>)(values, context, options);
  }, []);

  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    trigger,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<ApplyFormValues>({
    defaultValues: initial.values,
    resolver,
    mode: "onTouched",
  });
  const socials = useFieldArray({ control, name: "social_links" });

  const saveDraft = useCallback(() => {
    const { agree_terms: _ignored, ...values } = getValues();
    void _ignored;
    const now = Date.now();
    if (writeDraft({ version: 1, values, step: stepRef.current, collab: collabRef.current, savedAt: now })) {
      setSavedAt(now);
    }
  }, [getValues]);

  // Autosave (debounced) on every change.
  useEffect(() => {
    if (success) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const subscription = watch(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(saveDraft, 400);
    });
    return () => {
      subscription.unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, [watch, saveDraft, success]);

  // Move focus to the new step's heading (skip the first render).
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    topRef.current?.scrollIntoView({ block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const goTo = (next: number) => {
    stepRef.current = next;
    setStep(next);
    setSubmitError(null);
    saveDraft();
  };

  const updateCollab = (next: CollabDraft | null) => {
    collabRef.current = next;
    setCollab(next);
    saveDraft();
  };

  const startOver = () => {
    clearDraft();
    clientState.remove(SUBMITTED_KEY);
    reset(DEFAULT_VALUES);
    collabRef.current = null;
    setCollab(null);
    setSavedAt(null);
    setSuccess(null);
    stepRef.current = 0;
    setStep(0);
    setSubmitError(null);
  };

  const continueToNext = async () => {
    const valid = await trigger(undefined, { shouldFocus: true });
    if (!valid) return;
    trackEvent(`apply_step_${stepRef.current + 1}`);
    goTo(stepRef.current + 1);
  };

  const handleApiError = (err: unknown) => {
    if (!(err instanceof ApiError)) {
      setSubmitError(
        "We couldn't reach SeekKrr. Check your connection and try again. Your answers are saved on this device."
      );
      return;
    }
    if (err.status === 409) {
      setSubmitError(`${err.message} If you think this is a mistake, email ${siteConfig.email}.`);
      return;
    }
    if (err.status === 429) {
      setSubmitError(
        "You've sent a few applications in a short time. Please wait about 5 minutes and try again. Your answers are saved."
      );
      return;
    }
    if (err.status === 422) {
      const data = (err.data ?? {}) as { detail?: unknown };
      const details = Array.isArray(data.detail) ? data.detail : [];
      let firstStep: number | null = null;
      const fieldErrors: [FieldPath<ApplyFormValues>, string][] = [];
      for (const d of details) {
        const entry = d as { loc?: unknown[]; msg?: unknown };
        const field = (entry.loc ?? []).find(
          (part): part is string => typeof part === "string" && part in FIELD_STEP
        );
        if (!field) continue;
        fieldErrors.push([
          field as FieldPath<ApplyFormValues>,
          typeof entry.msg === "string" ? entry.msg : "Please check this field",
        ]);
        firstStep = Math.min(firstStep ?? LAST_STEP, FIELD_STEP[field]);
      }
      if (firstStep !== null) goTo(firstStep);
      for (const [field, message] of fieldErrors) setError(field, { type: "server", message });
      setSubmitError(
        firstStep !== null
          ? "Some details need another look. We've highlighted them."
          : err.message || "Some details need another look."
      );
      return;
    }
    setSubmitError(
      err.status >= 500
        ? "Something went wrong on our side. Please try again in a minute."
        : err.message || "We couldn't submit your application. Please try again."
    );
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (stepRef.current < LAST_STEP) {
      await continueToNext();
      return;
    }
    if (submittingRef.current) return;
    if (!(await trigger(undefined, { shouldFocus: true }))) return;

    // Re-check every earlier step (a restored draft may predate a rule change).
    const values = getValues();
    for (let i = 0; i < LAST_STEP; i++) {
      if (!STEP_SCHEMAS[i].safeParse(values).success) {
        goTo(i);
        await trigger();
        setSubmitError("A few details need another look before we can send this.");
        return;
      }
    }

    const details = STEP_SCHEMAS[0].parse(values);
    const location = STEP_SCHEMAS[1].parse(values);
    const socialsOut = STEP_SCHEMAS[2].parse(values);
    const plan = STEP_SCHEMAS[3].parse(values);
    const claiming = location.location_mode === "claim";
    const message = composeMessage(plan.message, collabRef.current);

    const payload: BusinessApplicationPayload = {
      ...details,
      claimed_marker_id: claiming ? location.claimed_marker_id : null,
      maps_url: claiming ? null : location.maps_url,
      region_id: claiming && values.region_id ? values.region_id : null,
      categories: socialsOut.categories,
      social_links: socialsOut.social_links.map((l) => l.url).filter(Boolean),
      requested_plan: plan.requested_plan,
      gstin: plan.gstin || null,
      message: message || null,
      source: "website",
    };

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitBusinessApplication(payload);
      trackEvent("apply_submitted", {
        plan: payload.requested_plan ?? "none",
        location: location.location_mode,
        collab: !!collabRef.current,
      });
      clientState.set(SUBMITTED_KEY, "true", 10 / 1440);
      clearDraft();
      setSuccess({ businessName: payload.business_name, email: payload.email, hasCollab: !!collabRef.current });
    } catch (err) {
      handleApiError(err);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <ApplySuccess
        businessName={success.businessName}
        email={success.email}
        hasCollab={success.hasCollab}
        onStartAnother={startOver}
      />
    );
  }

  const values = watch();
  const progress = ((step + 1) / STEPS.length) * 100;
  const selectedPlace = values.claimed_marker_id
    ? {
        id: values.claimed_marker_id,
        title: values.claimed_marker_title || "Selected place",
        address: values.claimed_marker_address,
        region_id: values.region_id,
      }
    : null;
  const errorText = (msg: unknown) => (typeof msg === "string" ? msg : undefined);

  return (
    <div ref={topRef} className="scroll-mt-28">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 font-jakarta text-[14px] font-bold text-black">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="text-black/60">{STEPS[step].short}</span>
        </div>
        <div
          role="progressbar"
          aria-label="Application progress"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={step + 1}
          aria-valuetext={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step].title}`}
          className="mt-2 h-4 overflow-hidden rounded-full border-[3px] border-black bg-white"
        >
          <div
            className="h-full bg-theme-yellow transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <ol className="mt-4 hidden grid-cols-5 gap-2 sm:grid">
          {STEPS.map((s, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => goTo(i)}
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-full px-2 py-1 text-left font-jakarta text-[13px] font-bold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue",
                    current ? "text-black" : done ? "text-black/70 hover:bg-black/5" : "text-black/35"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[12px]",
                      current
                        ? "border-black bg-black text-white"
                        : done
                          ? "border-black bg-theme-yellow"
                          : "border-black/30"
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className="truncate">{s.short}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {collab && (
        <div className="mb-6 flex items-start justify-between gap-3 rounded-[18px] border-2 border-dashed border-black bg-theme-yellow/30 px-4 py-3">
          <p className="min-w-0 text-[14px] leading-snug text-black/80">
            <span className="font-jakarta font-bold text-black">Collab idea attached: </span>
            {collab.want || "Your brief"} <span className="text-black/50">for</span> {collab.offer || "your offer"}
          </p>
          <button
            type="button"
            onClick={() => updateCollab(null)}
            aria-label="Remove the attached collab idea"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white hover:bg-theme-beige focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        noValidate
        aria-labelledby={`${id}-heading`}
        className="rounded-[24px] border-[3px] border-black bg-white p-5 [box-shadow:6px_6px_0_var(--color-yellow-accent)] sm:p-8 xl:rounded-[32px]"
      >
        <h2
          id={`${id}-heading`}
          ref={headingRef}
          tabIndex={-1}
          className="font-jakarta text-[24px] font-extrabold tracking-tight text-black outline-none sm:text-[28px]"
        >
          {STEPS[step].title}
        </h2>
        <p className="mb-6 mt-1 text-[15px] leading-relaxed text-black/65">{STEP_INTROS[step]}</p>

        {step === 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id={`${id}-business`} label="Business name" required error={errors.business_name?.message} className="sm:col-span-2">
              <Input autoComplete="organization" placeholder="e.g. Garden Café" {...register("business_name")} />
            </Field>
            <Field id={`${id}-contact`} label="Your name" required error={errors.contact_name?.message}>
              <Input autoComplete="name" placeholder="First and last name" {...register("contact_name")} />
            </Field>
            <Field id={`${id}-phone`} label="Phone" required error={errors.phone?.message} hint="We may call to verify the listing.">
              <Input type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" {...register("phone")} />
            </Field>
            <Field id={`${id}-email`} label="Email" required error={errors.email?.message} hint="Use the email you'll sign in to the app with." className="sm:col-span-2">
              <Input type="email" autoComplete="email" inputMode="email" placeholder="you@yourbusiness.com" {...register("email")} />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-5">
            <SegmentedToggle<LocationMode>
              ariaLabel="How to add your location"
              size="sm"
              value={values.location_mode}
              onChange={(mode) => {
                setValue("location_mode", mode, { shouldDirty: true });
                clearErrors(["claimed_marker_id", "maps_url"]);
              }}
              options={[
                { value: "claim", label: "Find my place" },
                { value: "maps", label: "Paste a Maps link" },
              ]}
              className="self-start"
            />
            {values.location_mode === "claim" ? (
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${id}-place`} className="font-jakarta text-[15px] font-semibold text-black">
                  Search SeekKrr places<span className="text-red-700" aria-hidden="true">*</span>
                </label>
                <PlaceSearch
                  inputId={`${id}-place`}
                  selected={selectedPlace}
                  error={errorText(errors.claimed_marker_id?.message)}
                  onSelect={(place) => {
                    setValue("claimed_marker_id", place?.id ?? "", { shouldDirty: true });
                    setValue("claimed_marker_title", place?.title ?? "");
                    setValue("claimed_marker_address", place?.address ?? "");
                    setValue("region_id", place?.region_id ?? "");
                    if (place) clearErrors("claimed_marker_id");
                  }}
                />
              </div>
            ) : (
              <Field
                id={`${id}-maps`}
                label="Google Maps link"
                required
                error={errors.maps_url?.message}
                hint="In Google Maps, open your place, tap Share and copy the link. It looks like https://maps.app.goo.gl/…"
              >
                <Input type="url" inputMode="url" placeholder="https://maps.app.goo.gl/…" {...register("maps_url")} />
              </Field>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-8">
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-1 font-jakarta text-[15px] font-semibold text-black">
                Social links <span className="font-normal text-black/55">(optional, but it speeds up verification)</span>
              </legend>
              {socials.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <Field
                    id={`${id}-social-${index}`}
                    label={<span className="sr-only">Social link {index + 1}</span>}
                    error={errors.social_links?.[index]?.url?.message}
                    className="flex-1"
                  >
                    <Input type="url" inputMode="url" placeholder="https://instagram.com/yourplace" {...register(`social_links.${index}.url`)} />
                  </Field>
                  {socials.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => socials.remove(index)}
                      aria-label={`Remove social link ${index + 1}`}
                      className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white hover:bg-theme-beige focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
              {errorText(errors.social_links?.message) && (
                <p role="alert" className="text-[13px] font-medium text-red-700">
                  {errors.social_links?.message}
                </p>
              )}
              {socials.fields.length < 10 && (
                <button
                  type="button"
                  onClick={() => socials.append({ url: "" })}
                  className="inline-flex items-center gap-1.5 self-start rounded-full px-1 font-jakarta text-[14px] font-bold text-black underline decoration-theme-yellow decoration-[3px] underline-offset-4 hover:decoration-black focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" /> Add another link
                </button>
              )}
            </fieldset>

            <fieldset aria-describedby={errors.categories ? `${id}-categories-error` : undefined}>
              <legend className="mb-3 font-jakarta text-[15px] font-semibold text-black">
                What kind of place is it?<span className="text-red-700" aria-hidden="true">*</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((category) => {
                  const selected = values.categories.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        const next = selected
                          ? values.categories.filter((c) => c !== category)
                          : [...values.categories, category].slice(0, 10);
                        setValue("categories", next, { shouldDirty: true, shouldValidate: !!errors.categories });
                      }}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 font-jakarta text-[14px] font-bold transition-colors",
                        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue",
                        selected ? "border-black bg-black text-white" : "border-black/30 bg-theme-beige text-black hover:border-black"
                      )}
                    >
                      {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />}
                      {category}
                    </button>
                  );
                })}
              </div>
              {errors.categories && (
                <p id={`${id}-categories-error`} role="alert" className="mt-2 text-[13px] font-medium text-red-700">
                  {errors.categories.message}
                </p>
              )}
            </fieldset>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <fieldset>
              <legend className="mb-3 font-jakarta text-[15px] font-semibold text-black">Plan you&apos;re interested in</legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {plans.map((plan) => (
                  <div key={plan.code}>
                    <input
                      type="radio"
                      id={`${id}-plan-${plan.code}`}
                      value={plan.code}
                      className="peer sr-only"
                      {...register("requested_plan")}
                    />
                    <label
                      htmlFor={`${id}-plan-${plan.code}`}
                      className={cn(
                        "flex h-full cursor-pointer flex-col gap-1 rounded-[18px] border-[3px] border-black/25 bg-theme-beige p-4 transition-all",
                        "hover:border-black peer-checked:border-black peer-checked:bg-white peer-checked:[box-shadow:4px_4px_0_var(--color-yellow-accent)]",
                        "peer-focus-visible:ring-[3px] peer-focus-visible:ring-theme-blue peer-focus-visible:ring-offset-2"
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-jakarta text-[17px] font-extrabold text-black">{plan.name}</span>
                        {plan.trial_days > 0 && (
                          <span className="rounded-full bg-theme-orange px-2 py-0.5 font-jakarta text-[11px] font-bold text-white">
                            {plan.trial_days}-day trial
                          </span>
                        )}
                      </span>
                      <span className="text-[14px] text-black/65">{planPrice(plan)}</span>
                    </label>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[13px] text-black/60">
                Compare everything on the{" "}
                <Link href="/business/pricing" target="_blank" className="font-semibold underline underline-offset-2">
                  pricing page
                </Link>
                .
              </p>
            </fieldset>

            <Field
              id={`${id}-gstin`}
              label="GSTIN"
              optional
              error={errors.gstin?.message}
              hint="Add it now and paid invoices will carry it. You can also add it later in Billing."
            >
              <Input autoComplete="off" maxLength={18} placeholder="03ABCDE1234F1Z5" className="uppercase placeholder:normal-case" {...register("gstin")} />
            </Field>

            <Field
              id={`${id}-message`}
              label="Anything else we should know?"
              optional
              error={errors.message?.message}
              hint={`${values.message.length}/${MESSAGE_MAX}`}
            >
              <Textarea
                rows={3}
                maxLength={MESSAGE_MAX}
                placeholder="Best time to call, number of locations, the kind of creators you'd love to host…"
                {...register("message")}
              />
            </Field>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-5">
            <ReviewSection title="Business details" onEdit={() => goTo(0)}>
              <ReviewRow label="Business" value={values.business_name} />
              <ReviewRow label="Contact" value={values.contact_name} />
              <ReviewRow label="Phone" value={values.phone} />
              <ReviewRow label="Email" value={values.email} />
            </ReviewSection>
            <ReviewSection title="Location" onEdit={() => goTo(1)}>
              {values.location_mode === "claim" ? (
                <ReviewRow
                  label="Claiming"
                  value={[values.claimed_marker_title, values.claimed_marker_address].filter(Boolean).join(" · ")}
                />
              ) : (
                <ReviewRow label="Maps link" value={values.maps_url} breakAll />
              )}
            </ReviewSection>
            <ReviewSection title="Socials & categories" onEdit={() => goTo(2)}>
              <ReviewRow
                label="Links"
                value={values.social_links.map((l) => l.url).filter(Boolean).join("\n") || "None added"}
                breakAll
              />
              <ReviewRow label="Categories" value={values.categories.join(", ")} />
            </ReviewSection>
            <ReviewSection title="Plan & billing" onEdit={() => goTo(3)}>
              <ReviewRow label="Plan" value={plans.find((p) => p.code === values.requested_plan)?.name ?? values.requested_plan} />
              <ReviewRow label="GSTIN" value={values.gstin.toUpperCase() || "Not added"} />
              {values.message && <ReviewRow label="Notes" value={values.message} />}
            </ReviewSection>

            {collab && (
              <div>
                <p className="mb-3 font-jakarta text-[15px] font-bold text-black">Your first collab idea</p>
                <CollabCard
                  want={collab.want}
                  offer={collab.offer}
                  description={collab.description}
                  mode={collab.mode}
                  deliverables={collab.deliverables}
                  disclosure={collab.disclosure}
                  isNew={false}
                />
                <p className="mt-3 text-[13px] text-black/60">
                  Sent with your application ({formatBrief(collab.deliverables, collab.disclosure) || collab.disclosure}).
                  You&apos;ll publish it from the app once verified.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={`${id}-terms`}
                  aria-invalid={errors.agree_terms ? true : undefined}
                  aria-describedby={errors.agree_terms ? `${id}-terms-error` : undefined}
                  className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-black focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
                  {...register("agree_terms")}
                />
                <label htmlFor={`${id}-terms`} className="text-[15px] leading-snug text-black/85">
                  I agree to the{" "}
                  <Link href="/business-terms" target="_blank" className="font-semibold underline underline-offset-2">
                    Business Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" target="_blank" className="font-semibold underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  , and I&apos;m authorised to represent this business.
                </label>
              </div>
              {errors.agree_terms && (
                <p id={`${id}-terms-error`} role="alert" className="pl-8 text-[13px] font-medium text-red-700">
                  {errors.agree_terms.message}
                </p>
              )}
            </div>
          </div>
        )}

        {submitError && (
          <div role="alert" className="mt-6 rounded-xl border-2 border-red-600 bg-red-50 px-4 py-3 text-[14px] font-medium text-red-800">
            {submitError}
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t-2 border-dashed border-black/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <Button variant="outline" onClick={() => goTo(step - 1)} disabled={submitting}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
            </Button>
          ) : (
            <span className="hidden sm:block" />
          )}
          {step < LAST_STEP ? (
            <Button type="submit" variant="primary">
              Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button type="submit" variant="primary" disabled={submitting} aria-busy={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Sending…
                </>
              ) : (
                "Submit application"
              )}
            </Button>
          )}
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-[13px] text-black/55">
        <p aria-live="polite">{savedAt ? "Draft saved on this device." : "Your answers save on this device as you go."}</p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear the form and start over?")) startOver();
          }}
          className="font-medium underline underline-offset-4 hover:text-black"
        >
          Start over
        </button>
      </div>
    </div>
  );
}

function ReviewSection({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <section className="rounded-[18px] border-2 border-black/15 bg-theme-beige p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="font-jakarta text-[16px] font-bold text-black">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1 rounded-full border-2 border-black bg-white px-3 py-1 font-jakarta text-[13px] font-bold hover:bg-theme-yellow focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit<span className="sr-only"> {title}</span>
        </button>
      </div>
      <dl className="flex flex-col gap-1.5">{children}</dl>
    </section>
  );
}

function ReviewRow({ label, value, breakAll }: { label: string; value: string; breakAll?: boolean }) {
  return (
    <div className="grid grid-cols-[96px_1fr] gap-3 text-[14px] sm:grid-cols-[120px_1fr]">
      <dt className="text-black/55">{label}</dt>
      <dd className={cn("whitespace-pre-line font-medium text-black", breakAll ? "break-all" : "break-words")}>
        {value || "—"}
      </dd>
    </div>
  );
}
