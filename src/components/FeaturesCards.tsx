import { motion } from 'framer-motion';

const cardFeatures = [
  {
    title: 'GUI built for threat intelligence',
    description: 'Modern & Intuitive dashboards with STIX-structured knowledge hypergraph to allow analysts pivot across actors, malware, TTPs, and indicators with visual graphs, timelines, and ATT&CK mappings'
  },
  {
    title: 'Work Faster And Analyze better with AI',
    description: 'Make AI your companion at every step of your activities (threat feeds import, search, insights and generating summaries) as well as your output (finished with template and tone based on your targeted audience).'
  },
  {
    title: 'Actionable Insights Dashboard',
    description: 'Visualize critical threats with intuitive analytics that highlight risk severity, trends, and real-time impact — so you can make data-driven decisions and focus resources where they matter most.'
  }
];

export default function FeaturesCards() {
  return (
    <section className="py-24 px-4 bg-linear-to-b from-[#0a0a0a] to-black">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-center mb-16 text-white tracking-tight"
        >
          Key Platform Capabilities
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cardFeatures.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0f0f0f] border border-white/5 p-8 rounded-xl shadow-2xl hover:border-white/20 transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-4 tracking-tight text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
