import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/GlassCard';
import { PollView } from '@/components/PollView';
import { FloatingShapes } from '@/components/FloatingShapes';
import { usePollStore } from '@/stores/pollStore';

export default function PollPage() {
  const { id } = useParams<{ id: string }>();
  const poll = usePollStore((state) => state.getPoll(id || ''));

  useEffect(() => {
    if (poll) {
      // Update document title
      document.title = `${poll.title} - Suggestion Box`;
      
      // Update or create meta tags
      const updateMetaTag = (property: string, content: string) => {
        let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('property', property);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      };

      updateMetaTag('og:title', poll.title);
      updateMetaTag('og:description', poll.description || 'Vote on suggestions and share your ideas!');
      updateMetaTag('og:type', 'website');
    } else {
      document.title = 'Poll Not Found - Suggestion Box';
    }
  }, [poll]);

  if (!poll) {
    return (
      <div className="min-h-screen gradient-mesh relative">
        <FloatingShapes />
        <div className="relative z-10 container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
          <GlassCard hover={false} className="p-8 max-w-md text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4"
            >
              <AlertCircle className="w-8 h-8 text-destructive" />
            </motion.div>
            <h2 className="text-2xl font-bold font-display mb-2">Poll Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This poll doesn't exist or may have been removed.
            </p>
            <Link to="/">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Create a New Poll
              </Button>
            </Link>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-mesh relative">
      <FloatingShapes />
      <div className="relative z-10 container mx-auto px-4 py-12">
        <PollView poll={poll} />
      </div>
    </div>
  );
}
