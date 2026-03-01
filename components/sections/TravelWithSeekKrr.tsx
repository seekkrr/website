"use client";

import { motion, useTime, useTransform, useMotionTemplate } from "framer-motion";
import { siteConfig } from "@/lib/config/site";

/* ------------------------------------------------------------------ */
/*  Bird card data                                                    */
/* ------------------------------------------------------------------ */
interface BirdCard {
    angle: number;
    lines: React.ReactNode;
    bg: string;
    textColor: string;
    highlight?: boolean;
}

const BIRD_CARDS: BirdCard[] = [
    {
        angle: 0,
        lines: <>Download<br />the<br />{siteConfig.name}<br />App</>,
        bg: "var(--color-beige)",
        textColor: "var(--color-green-dark)",
    },
    {
        angle: 90,
        lines: <>Explore<br />Quests<br />With<br />Different<br />Themes</>,
        bg: "var(--color-beige)",
        textColor: "var(--color-green-dark)",
    },
    {
        angle: 180,
        lines: (
            <>
                Purchase<br />Quests<br />
                <span className="line-through opacity-70">₹500</span> = 0₹<br />
                (Early Bird<br />Offer)
            </>
        ),
        bg: "var(--color-yellow-accent)",
        textColor: "var(--color-green-dark)",
        highlight: true,
    },
    {
        angle: 270,
        lines: <>Travel<br />without<br />the<br />Worry Of<br />Itinerary</>,
        bg: "var(--color-beige)",
        textColor: "var(--color-green-dark)",
    },
];

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
export function TravelWithSeekKrr() {
    return (
        <section className="w-full bg-theme-beige overflow-hidden flex flex-col items-center justify-center">
            <InjectBirdStyles />
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-[1240px] mx-auto px-4 lg:px-8 flex items-center justify-center"
                style={{ willChange: "transform, opacity" }}
            >
                <div className="relative w-[520px] h-[520px] sm:w-[640px] sm:h-[640px] md:w-[760px] md:h-[760px] lg:w-[900px] lg:h-[900px]">

                    {/* Central text (static) */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <h2
                            className="font-handwriting text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] font-bold leading-[1.15] text-center text-black whitespace-pre-line [text-shadow:3px_3px_0_var(--color-orange-accent)]"
                        >
                            {`Travel\nWith\n${siteConfig.name}`}
                        </h2>
                    </div>

                    {/* Orbit Container (Static, no rotation, math done on individual birds) */}
                    <div className="absolute inset-0">
                        {BIRD_CARDS.map((card) => (
                            <OrbitBird key={card.angle} card={card} />
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  Orbit Bird                                                        */
/*                                                                    */
/*  Architecture:                                                     */
/*  Using Framer Motion useTime to mathematically lock translations   */
/*  and rotations to Native JS Ticks, avoiding deeply nested CSS      */
/*  matrix bugs and hardware acceleration weirdness.                  */
/* ------------------------------------------------------------------ */
function OrbitBird({ card }: { card: BirdCard }) {
    const time = useTime(); // Frame-perfect time in milliseconds
    const duration = 35000; // 35 seconds per full orbit

    // Calculate the absolute visual rotation of the orbit in degrees
    const currentAbsoluteOrbitAngleDeg = useTransform(time, (t) => {
        const progress = (t % duration) / duration;
        return (progress * 360) + card.angle;
    });

    return (
        <motion.div
            className="absolute top-1/2 left-1/2"
            style={{
                // Expose exact angle.
                "--angle": useMotionTemplate`${currentAbsoluteOrbitAngleDeg}deg`,
                // Explicitly mathematical trigonometric orbit path!
                // 0 degrees => x=0, y=-R (Top position)
                // Guaranteed Native JS/CSS sync without deeply nested rotation transforms.
                "--radius": "clamp(190px, 26vw, 270px)",
                transform: "translate(calc(sin(var(--angle)) * var(--radius)), calc(cos(var(--angle)) * var(--radius) * -1))",
                marginLeft: "-75px",
                marginTop: "-150px",
                width: "150px",
                height: "300px",
                willChange: "transform",
            } as any}
        >
            {/* Rotation container — both layers share this exact transform */}
            <div
                className="absolute inset-0"
                style={{
                    transform: "rotate(var(--angle)) rotate(180deg)",
                    willChange: "transform",
                    transformOrigin: "center center",
                }}
            >
                {/* Layer 1 (BOTTOM): Wings & tail — flaps via scaleY */}
                <div
                    className="absolute inset-0"
                    style={{ animation: "bird-flap 0.6s ease-in-out infinite", transformOrigin: "center center" }}
                >
                    <WingsSvg muted={!card.highlight} />
                </div>

                {/* Layer 2 (TOP): Body rect + head + beak — STATIC, covers wing seams */}
                <div className="absolute inset-0">
                    <BodySvg bodyColor={card.bg} muted={!card.highlight} />
                </div>
            </div>

            {/* The Text — Fixed size, centered in the orbit element.
                Uses fixed pixel dimensions so it NEVER changes size
                regardless of the bird's flap/scale animation.
            */}
            <div
                className="absolute overflow-hidden flex items-center justify-center text-center pointer-events-none"
                style={{
                    width: "90px",
                    height: "130px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <div className="w-full h-full flex items-center justify-center px-1 overflow-hidden">
                    <span
                        className="font-jakarta font-bold text-[9px] sm:text-[10px] lg:text-[12px] leading-[1.2] drop-shadow-sm"
                        style={{ color: card.textColor, wordBreak: "break-word" }}
                    >
                        {card.lines}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/*  CSS Bob Animations (injected at component level)                  */
/* ------------------------------------------------------------------ */
export function InjectBirdStyles() {
    return (
        <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes bird-flap {
                0%, 100% { transform: scaleY(1); }
                50% { transform: scaleY(0.85); }
            }
        `}} />
    );
}

/* ------------------------------------------------------------------ */
/*  Layer 1: Wings & tail SVG (gets flap animation — rendered BEHIND)  */
/* ------------------------------------------------------------------ */
function WingsSvg({ muted = false }: { muted?: boolean }) {
    const bg = "var(--color-beige)";
    const blue = muted ? bg : "var(--color-blue-accent)";
    const orange = muted ? bg : "var(--color-orange-accent)";
    const dark = "var(--color-green-dark)";
    return (
        <svg viewBox="0 0 173 341" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full pointer-events-none select-none">
            {/* Outline strokes for wing structures */}
            <path d="M31.458 17.9546C21.0425 9.73951 9.63677 12.3312 5.23586 14.6539L31.458 64.7143L41.5434 91.3032V86.7189H47.9614M31.458 17.9546C34.2452 30.5705 43.6216 69.0541 47.9614 86.7189M31.458 17.9546L28.3407 0.534255C34.942 0.900998 49.0983 5.44861 52.9125 20.7051M47.9614 86.7189C49.1839 70.8878 51.8856 35.5216 52.9125 20.7051M47.9614 86.7189C48.6949 85.4964 54.7095 71.7925 72.9 26.7564M47.9614 86.7189C49.0617 85.9854 58.597 77.0369 87.9364 47.1106M47.9614 86.7189C49.6118 86.0465 61.4209 81.0344 95.4547 66.3647M47.9614 86.7189C60.1862 86.7189 86.7995 86.7189 95.4547 86.7189C101.469 84.8118 103.584 71.2546 103.89 64.7143L95.4547 66.3647M52.9125 20.7051L54.5628 3.83494C59.6361 4.69068 70.4061 10.473 72.9 26.7564M72.9 26.7564L78.9512 14.6539C83.4133 18.4435 91.4572 30.2405 87.9364 47.1106M87.9364 47.1106L97.6551 38.6755C99.4277 44.3601 101.469 57.8562 95.4547 66.3647M31.458 322.429C21.0425 330.694 9.63677 328.087 5.23586 325.75L31.458 275.386L41.5434 248.636V253.248H47.9614M31.458 322.429C34.2452 309.737 43.6216 271.02 47.9614 253.248M31.458 322.429L28.3407 339.955C34.942 339.586 49.0983 335.011 52.9125 319.662M47.9614 253.248C49.1839 269.175 51.8856 304.756 52.9125 319.662M47.9614 253.248C48.6949 254.478 54.7095 268.265 72.9 313.574M47.9614 253.248C49.0617 253.986 58.597 262.989 87.9364 293.096M47.9614 253.248C49.6118 253.925 61.4209 258.967 95.4547 273.726M47.9614 253.248H95.4547C101.469 255.167 103.584 268.806 103.89 275.386L95.4547 273.726M52.9125 319.662L54.5628 336.634C59.6361 335.773 70.4061 329.956 72.9 313.574M72.9 313.574L78.9512 325.75C83.4133 321.937 91.4572 310.069 87.9364 293.096M87.9364 293.096L97.6551 301.583C99.4277 295.864 101.469 282.286 95.4547 273.726M159.635 194.541C155.967 205.25 149.672 205.116 146.982 203.71L109.024 186.473V176.938M159.635 194.541C146.725 189.847 120.515 180.85 109.024 176.938M159.635 194.541L164.402 196.375L167.703 181.155M109.024 176.938V174.187M167.703 181.155L109.024 174.187M167.703 181.155L171.921 181.889V158.967L167.703 159.41M109.024 174.187V165.569M109.024 165.569L167.703 159.41M109.024 165.569V162.085M167.703 159.41L164.402 144.481L158.901 146.23M109.024 162.085L158.901 146.23M109.024 162.085V153.466C118.498 149.187 139.354 139.823 146.982 136.596C154.61 133.515 158.107 141.735 158.901 146.23" stroke={dark} />
            <path d="M60.6473 249.368H41.7601C41.4544 250.428 39.0095 257.256 31.6746 276.098C56.6131 277.145 61.3808 258.714 60.6473 249.368Z" stroke={dark} />
            {/* Right wing feathers */}
            <path d="M137.526 152.537V141.537C138.193 141.204 140.526 139.539 147.026 137.037C153.526 134.535 157.57 141.541 158.526 146.037L137.526 152.537Z" fill={blue} stroke={dark} strokeWidth="0.5" />
            <path d="M137.526 162.035V153.535L164.026 145.035L167.026 159.035L137.526 162.035Z" fill={blue} stroke={dark} strokeWidth="0.5" />
            <path d="M137.526 177.035V163.035L171.526 159.535V181.535L137.526 177.035Z" fill={blue} stroke={dark} strokeWidth="0.5" />
            <path d="M137.526 186.035V178.035L167.026 181.535L164.026 195.535L137.526 186.035Z" fill={blue} stroke={dark} strokeWidth="0.5" />
            <path d="M137.526 199.035V187.535L159.026 195.035C158.026 197.535 156.127 200.604 155.026 201.535C148.526 207.035 147.026 201.535 137.526 199.035Z" fill={blue} stroke={dark} strokeWidth="0.5" />
            {/* Top tail feathers */}
            <path d="M97.5259 39.5352C95.9259 40.3352 87.8592 48.2018 84.0259 52.0352H99.0259C99.5259 49.0352 98.5259 42.5352 97.5259 39.5352Z" fill={blue} stroke={dark} strokeWidth="0.5" />
            <path d="M51.0259 52.0352L55.0259 4.53516C65.8259 6.53516 71.1925 20.0352 72.5259 26.5352L62.0259 52.0352H51.0259Z" fill={blue} stroke={dark} strokeWidth="0.5" />
            <path d="M39.0259 52.0352L31.0259 18.5352C21.4259 10.5352 10.3592 12.8685 6.02588 15.0352L25.5259 52.0352H39.0259Z" fill={blue} stroke={dark} strokeWidth="0.5" />
            <path d="M82.5259 52.0352H63.5259C65.5259 45.0352 73.5259 26.0352 79.0259 15.5352C89.0259 24.7352 88.8592 40.3685 87.5259 47.0352L82.5259 52.0352Z" fill={orange} stroke={dark} strokeWidth="0.5" />
            <path d="M40.0259 52.0352C37.6259 43.2352 31.5259 18.0352 29.0259 1.03516C45.8259 3.83516 51.6925 15.5352 52.5259 21.0352L50.0259 52.0352H40.0259Z" fill={orange} stroke={dark} strokeWidth="0.5" />
            {/* Bottom tail feathers */}
            <path d="M97.5259 300.535C92.5259 296.202 82.4259 287.235 82.0259 286.035H98.5259C99.3259 287.235 98.1925 296.202 97.5259 300.535Z" fill={blue} stroke={dark} strokeWidth="0.5" />
            <path d="M55.0259 336.035L51.0259 286.035H61.5259C61.6925 286.535 64.1259 292.835 72.5259 314.035C69.7259 329.235 59.6925 335.035 55.0259 336.035Z" fill={blue} stroke={dark} strokeWidth="0.5" />
            <path d="M26.5259 286.035H39.5259C39.3592 286.702 37.4259 294.835 31.0259 322.035C21.8259 330.035 10.5259 327.702 6.02588 325.535L26.5259 286.035Z" fill={blue} stroke={dark} strokeWidth="0.5" />
            <path d="M79.0259 325.035C77.4259 323.435 67.3592 298.368 62.5259 286.035H80.0259L87.5259 293.535C90.5067 311.917 82.6275 320.92 79.0934 324.958L79.0259 325.035Z" fill={orange} stroke={dark} strokeWidth="0.5" />
            <path d="M50.0259 286.035C50.8592 297.035 52.5259 319.235 52.5259 320.035C47.5259 335.035 35.5259 338.535 29.0259 339.535C30.0259 328.535 40.5259 286.535 40.5259 286.035C40.5259 285.635 46.8592 285.868 50.0259 286.035Z" fill={orange} stroke={dark} strokeWidth="0.5" />
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/*  Layer 2: Body + head + beak SVG (STATIC — rendered ON TOP)        */
/* ------------------------------------------------------------------ */
function BodySvg({ bodyColor, muted = false }: { bodyColor: string; muted?: boolean }) {
    const bg = "var(--color-beige)";
    const blue = muted ? bg : "var(--color-blue-accent)";
    const dark = "var(--color-green-dark)";
    return (
        <svg viewBox="0 0 173 341" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full pointer-events-none select-none">
            {/* Body rect — covers wing attachment seams */}
            <path d="M26.1553 52.662V285.564H136.928V52.662H26.1553Z" fill={bodyColor} stroke={dark} />
            {/* Head/eye */}
            <path d="M26.0259 155.793C10.5824 152.271 9.47913 185.995 26.0259 184.486V155.793Z" fill={dark} stroke={dark} strokeWidth="0.5" />
            <path d="M25.5259 162.535H17.5259C15.5259 166.535 15.5259 173.035 17.5259 178.035H25.5259V162.535Z" fill={blue} stroke={blue} strokeWidth="0.5" />
            {/* Beak */}
            <path d="M14.5259 177.035L2.02588 170.535L14.5259 163.035C13.3259 167.035 14.0259 174.035 14.5259 177.035Z" fill={muted ? bg : "var(--color-orange-accent)"} stroke={dark} strokeWidth="0.5" />
        </svg>
    );
}
