'use client';

import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="relative bg-white border-t border-gray-200 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="text-center space-y-1"
          >
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {currentYear} Evangelical Students’ and Graduates’ Union of Ethiopia (EvaSUE) 

            </p>

            <p className="text-gray-600 text-xs">
              የኢትዮጵያ ወንጌላዊያን ተማሪዎችና ምሩቃን ማህበር (ኢቫሱ)
            </p>

            <p className="text-gray-600 text-xs">
              EvaSUE is a faith-based organization registered in Ethiopia.
            </p>
            <p className="text-gray-600 text-xs">
              EvaSUE-USA is a registered 501(c)3 nonprofit organization in the USA.
            </p>
            <a
              href="https://ifesworld.org"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-600 text-xs hover:text-blue-600"
            >
             A Member of the International Fellowship of Evangelical Students (IFES).
           </a>

            <p className="text-gray-600 text-xs">
              We are committed to handling all your data appropriately. See our Privacy Policy|Terms of Use
            </p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};