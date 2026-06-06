import { motion } from 'framer-motion';

export default function OurStorySection({ story = {} }) {
  const {
    label = 'OUR STORY',
    headline = 'Welcome To',
    headlineBold = 'Relax Station',
    paragraph1 = "Relax Station is a family-friendly restaurant tucked away in a quiet, beautiful corner. Our guests call us 'the most peaceful cafe with the best food, filling lunches and delicious dinners'. We believe that our food is a reflection of our pride. We wanted to bring the freshest of ingredients made into the best dishes for our guests to enjoy in a comfortable, lively environment.",
    paragraph2 = "We've been working in the hospitality industry for years and opened Relax Station knowing what families and friends wanted. Guests come here to enjoy a place where the food is freshly made for every dish in our dedicated kitchen. We treat all our guests with honesty and respect. Every effort has been placed to create a delicious and inventive menu in our clean neat kitchen.",
    signOff = '- The Management & all the staff',
    signOffSub = 'Relax Station, Owners',
    backgroundImage = '',
  } = story;

  // Working cloud image fallback to see the blend immediately
  const liveFallbackImage = "https://unsplash.com";

  return (
    <section className="relative bg-gradient-to-b from-white via-stone-50 to-white py-24 overflow-hidden">

      {/* Soft background glow for blending */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 right-0 w-96 h-96 bg-brand-200/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/10 blur-3xl rounded-full" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-12 gap-14 items-center">

        {/* LEFT - TEXT */}
        <div className="md:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block relative pb-2 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
                {label}
              </span>
              <span className="absolute bottom-0 left-0 w-10 h-[2px] bg-brand-500" />
            </div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-stone-800 leading-tight">
              {headline}{' '}
              <span className="font-bold text-stone-900">{headlineBold}</span>
            </h2>

            <div className="mt-8 space-y-5 text-stone-600 leading-relaxed text-sm md:text-base">
              <p>{paragraph1}</p>
              {paragraph2 && <p>{paragraph2}</p>}
            </div>

            {(signOff || signOffSub) && (
              <div className="mt-8 pt-6 border-t border-stone-200/60 text-stone-700">
                {signOff && (
                  <p className="text-sm font-medium italic">{signOff}</p>
                )}
                {signOffSub && (
                  <p className="text-xs uppercase tracking-wider text-stone-400 mt-1 font-semibold">
                    {signOffSub}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT - BLENDED IMAGE */}
        <div className="md:col-span-5">
          <div className="relative p-8 -m-8 overflow-visible">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden group shadow-[-25px_25px_50px_-15px_rgba(0,0,0,0.25)]"
            >
              {/* IMAGE */}
              <img
                src={backgroundImage || liveFallbackImage}
                alt="Relax Station Story"
                className="h-full w-full object-cover scale-105 transition-transform duration-700 group-hover:scale-110"
              />

              {/* INSET LEFT SHADOW MASK MATCHING STONE-50 GRADIENT */}
              <div 
                className="absolute inset-0 pointer-events-none z-10" 
                style={{
                  background: 'linear-gradient(to right, rgba(250,249,246,0.95) 0%, rgba(250,249,246,0.6) 12%, rgba(250,249,246,0) 40%)'
                }}
              />

              {/* INSET TOP SHADOW MASK MATCHING WHITE GRADIENT */}
              <div 
                className="absolute inset-0 pointer-events-none z-10" 
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 8%, rgba(255,255,255,0) 25%)'
                }}
              />

              {/* DARK TO LIGHT GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-stone-900/5 to-transparent pointer-events-none" />

              {/* SOFT EDGE BLUR */}
              <div className="absolute -inset-1 blur-xl opacity-10 bg-white pointer-events-none" />
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
