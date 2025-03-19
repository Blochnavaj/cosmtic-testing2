import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaGripVertical } from 'react-icons/fa';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';

const FAQItem = ({ id, question, answer, index, moveItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'FAQ',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'FAQ',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <motion.div 
      ref={preview}
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div
        ref={(node) => drag(drop(node))}
        className={`bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 ${
          isOpen ? 'border-rose-300' : 'border-transparent'
        } ${isDragging ? 'opacity-50' : ''}`}
      >
        <div className="flex items-start gap-4">
          <span className="text-rose-200 hover:text-rose-300 mt-1 cursor-move transition-colors" 
                onClick={(e) => e.stopPropagation()}>
            <FaGripVertical />
          </span>
          <div className="flex-1">
            <div className="flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
              <motion.h4 
                className="font-medium text-gray-800 text-lg hover:text-rose-300 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                {question}
              </motion.h4>
              {isOpen ? (
                <FaChevronUp className="text-rose-300 animate-rotate-up" />
              ) : (
                <FaChevronDown className="text-gray-400 animate-rotate-down" />
              )}
            </div>
            {isOpen && (
              <motion.p 
                className="text-gray-600 mt-4 pl-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {answer}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function About() {
  const [faqs, setFaqs] = useState([
    { id: 1, question: "Are your products cruelty-free?", answer: "Yes! We are 100% cruelty-free and do not test on animals." },
    { id: 2, question: "Do you use natural ingredients?", answer: "Yes, we carefully source natural and safe ingredients for all our products." },
    { id: 3, question: "Is your packaging eco-friendly?", answer: "Absolutely! We prioritize sustainability and use eco-friendly packaging." },
    { id: 4, question: "Are your products safe for sensitive skin?", answer: "Yes, our dermatologist-tested formulas are designed to be safe for all skin types." },
    { id: 5, question: "Where can I buy your products?", answer: "You can explore and purchase our products on our official website." }
  ]);

  const moveItem = (fromIndex, toIndex) => {
    const updatedFaqs = [...faqs];
    const [movedItem] = updatedFaqs.splice(fromIndex, 1);
    updatedFaqs.splice(toIndex, 0, movedItem);
    setFaqs(updatedFaqs);
  };

  const stats = [
    { value: "100%", label: "Cruelty Free", icon: "🐇" },
    { value: "500+", label: "Natural Ingredients", icon: "🌿" },
    { value: "Eco", label: "Sustainable Packaging", icon: "♻️" },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <section className="min-h-screen flex items-center justify-center mt-28 p-6 bg-gradient-to-b from-rose-50/50 to-white/50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-32 -left-48 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-48 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl"></div>

        <div className="max-w-6xl w-full z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl font-playfair font-bold text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-gray-400 to-rose-400 bg-clip-text text-transparent">
                About Our Essence
              </span>
            </h2>
            <div className="flex justify-center mb-8">
              <div className="w-24 h-1 bg-rose-300 rounded-full" />
            </div>
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto mb-12">
              At the heart of our brand lies a passion for pure, transformative beauty. 
              We craft luxurious, sustainable cosmetics that celebrate your natural radiance 
              while nurturing your skin with nature's finest ingredients.
            </p>
            
            <motion.div 
              className="grid md:grid-cols-3 gap-8 mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-rose-50 hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <h3 className="text-3xl font-playfair font-semibold text-rose-300 mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="relative rounded-3xl overflow-hidden shadow-2xl mx-auto mb-16 w-full h-96"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80"
                alt="Luxury cosmetics"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-playfair font-bold mb-2">Luxury Redefined</h3>
                <p className="opacity-90">Ethical Beauty, Exceptional Quality</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-3xl font-playfair font-semibold text-center text-gray-800 mb-12">
              Your Questions Answered
            </h3>
            <div className="space-y-6 max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <FAQItem key={faq.id} {...faq} index={index} moveItem={moveItem} />
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Link 
              to='/collection' 
              className="bg-rose-300 hover:bg-rose-400 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 inline-flex items-center gap-3 transform hover:-translate-y-1 shadow-lg hover:shadow-rose-300/30 group"
            >
              <span>Discover Our Collection</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </DndProvider>
  );
}

export default About;