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

  return (
    <section className="bg-white py-20 border-t border-b border-stone-100/60">
      <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Left Column - Text Content */}
        <div className="md:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Tag label with line underneath */}
            <div className="inline-block relative pb-2 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400 font-display">
                {label}
              </span>
              <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-brand-500" />
            </div>

            {/* Main Header */}
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-stone-800 leading-tight">
              {headline} <span className="font-bold text-stone-900">{headlineBold}</span>
            </h2>

            {/* Paragraph Description */}
            <div className="mt-8 space-y-5 text-stone-600 leading-relaxed text-sm md:text-base">
              <p>{paragraph1}</p>
              {paragraph2 && <p>{paragraph2}</p>}
            </div>

            {/* Sign-off Signature */}
            {(signOff || signOffSub) && (
              <div className="mt-8 pt-6 border-t border-stone-100/80 text-stone-700">
                {signOff && (
                  <p className="text-sm font-medium italic">
                    {signOff}
                  </p>
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

        {/* Right Column - Image Content */}
        <div className="md:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-2xl border border-stone-100 bg-stone-50"
          >
            <img
              src={backgroundImage || '/story-bg.jpg'}
              alt="Relax Station Story"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
