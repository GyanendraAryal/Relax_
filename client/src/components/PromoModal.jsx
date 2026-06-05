import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reusable Confirmation & Announcement Modal
 * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Triggers on dismissal or cancel
 * @param {function} onConfirm - Triggers when clicking primary action (optional)
 * @param {string} title - Main header text
 * @param {string} message - Body description text
 * @param {'info' | 'danger' | 'success'} type - Controls the semantic visual styling
 * @param {string} confirmText - Label for the primary button
 */
export default function PromoModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  type = "info",
  confirmText = "Confirm",
  children
}) {
  
  // Semantic style mappings for varying action contexts
  const themes = {
    danger: {
      bg: "from-red-600 to-rose-700",
      border: "border-red-100",
      accentBg: "bg-red-50",
      btn: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      badge: "⚠️ Action Required"
    },
    success: {
      bg: "from-emerald-600 to-teal-700",
      border: "border-emerald-100",
      accentBg: "bg-emerald-50",
      btn: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
      badge: "🎉 Success"
    },
    info: {
      bg: "from-forest-800 to-brand-600",
      border: "border-brand-100",
      accentBg: "bg-brand-50",
      btn: "bg-brand-600 hover:bg-brand-700 focus:ring-brand-500",
      badge: "🔥 Notice"
    }
  };

  const currentTheme = themes[type] || themes.info;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />

          {/* Modal Container Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={`relative w-full max-w-md overflow-hidden rounded-2xl border bg-white shadow-2xl ${currentTheme.border}`}
          >
            {/* Header Block Accent */}
            <div className={`bg-gradient-to-r ${currentTheme.bg} px-6 py-5 text-white`}>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
                {currentTheme.badge}
              </span>
              <h3 className="mt-2 font-display text-xl font-bold tracking-tight">
                {title}
              </h3>
            </div>

            {/* Modal Body Window */}
            <div className="p-6">
              <p className="text-stone-600 text-sm leading-relaxed">
                {message}
              </p>

              {/* Slot to drop in custom fields like prices or slide buttons if needed */}
              {children}

              {/* Dynamic Action Buttons Footer */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-stone-100 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50 active:bg-stone-100"
                >
                  Cancel
                </button>
                
                {onConfirm && (
                  <button
                    type="button"
                    onClick={onConfirm}
                    className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentTheme.btn}`}
                  >
                    {confirmText}
                  </button>
                )}
              </div>
            </div>

            {/* Close Cross Icon */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-white transition hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


{/* <PromoModal
  isOpen={isDeleteOpen}
  type="danger"
  title="Delete Menu Item?"
  message="Are you absolutely sure? This will permanently remove the dish from the active customer menu database items list."
  confirmText="Delete Permanently"
  onClose={() => setIsDeleteOpen(false)}
  onConfirm={handleDeleteSubmit}
/> */}


// <PromoModal
//   isOpen={isAddOpen}
//   type="success"
//   title="Item Added Successfully"
//   message="The item has been committed to the inventory registry and is now active."
//   confirmText="View Item"
//   onClose={() => setIsAddOpen(false)}
//   onConfirm={navigateToInventory}
// />
