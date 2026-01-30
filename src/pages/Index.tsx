import { motion } from 'framer-motion';
import { MessageSquarePlus, Sparkles, Users, Lock } from 'lucide-react';
import { CreatePollForm } from '@/components/CreatePollForm';
import { FloatingShapes } from '@/components/FloatingShapes';

const features = [
  {
    icon: MessageSquarePlus,
    title: 'Collect Ideas',
    description: 'Gather suggestions from anyone, no sign-up required',
  },
  {
    icon: Users,
    title: 'Public Voting',
    description: 'Let people vote on the best suggestions',
  },
  {
    icon: Lock,
    title: 'Token Access',
    description: 'Edit your poll with a private URL token',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen gradient-mesh relative">
      <FloatingShapes />
      
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="h-4 w-4" />
            No account needed
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-6">
            <span className="gradient-text">Suggestion Box</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Create polls, collect ideas, and let your community vote.
            <br className="hidden md:block" />
            Simple, beautiful, and completely anonymous.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold font-display text-lg mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Create Poll Form */}
        <CreatePollForm />
        
        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 text-sm text-muted-foreground"
        >
          <p>Built with ❤️ for open collaboration</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
