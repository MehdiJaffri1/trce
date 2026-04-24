import { motion } from 'framer-motion';

const stats = [
  { value: '70%', label: 'faster threat detection and response' },
  { value: '25%', label: 'reduction in false positives' },
  { value: '300+', label: 'connectors' },
  { value: '6K', label: 'deployments by practitioners' },
];

export default function Stats() {
  return (
    <section className="bg-linear-to-b from-[#111111] to-black py-20 px-4 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 border border-white/5 bg-white/5 backdrop-blur-sm rounded-lg hover:border-white/20 transition-all duration-300"
            >
              <div className="text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-widest">{stat.label}</div>
              <div className="text-2xl font-bold tracking-tight text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
