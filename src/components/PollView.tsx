import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { Copy, Check, Plus, Share2, ArrowLeft, Settings, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/GlassCard';
import { SuggestionItem } from '@/components/SuggestionItem';
import { usePollStore } from '@/stores/pollStore';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import type { Poll } from '@/types/poll';

interface PollViewProps {
  poll: Poll;
}

export function PollView({ poll }: PollViewProps) {
  const isEditable = apiClient.hasEditPermission(poll.id);
  
  const [newSuggestion, setNewSuggestion] = useState('');
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [copiedEdit, setCopiedEdit] = useState(false);
  
  const { addSuggestion, voteSuggestion, deleteSuggestion, updateSuggestion, updatePoll } = usePollStore();

  // Load voted IDs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`poll-votes-${poll.id}`);
    if (stored) {
      setVotedIds(new Set(JSON.parse(stored)));
    }
  }, [poll.id]);

  const handleVote = async (suggestionId: string) => {
    if (votedIds.has(suggestionId)) {
      toast.info("You've already voted for this suggestion");
      return;
    }
    
    try {
      await apiClient.voteSuggestion(poll.id, suggestionId);
      voteSuggestion(poll.id, suggestionId);
      const newVotedIds = new Set(votedIds).add(suggestionId);
      setVotedIds(newVotedIds);
      localStorage.setItem(`poll-votes-${poll.id}`, JSON.stringify([...newVotedIds]));
      toast.success('Vote recorded!');
    } catch (error) {
      console.error('Failed to vote:', error);
      toast.error('Failed to record vote. Please try again.');
    }
  };

  const handleAddSuggestion = async () => {
    if (!newSuggestion.trim()) {
      toast.error('Please enter a suggestion');
      return;
    }
    
    try {
      const suggestion = await apiClient.addSuggestion(poll.id, newSuggestion.trim());
      addSuggestion(poll.id, {
        id: suggestion.id,
        text: suggestion.text,
        votes: 0,
        createdAt: new Date(suggestion.created_at),
      });
      
      setNewSuggestion('');
      toast.success('Suggestion added!');
    } catch (error) {
      console.error('Failed to add suggestion:', error);
      toast.error('Failed to add suggestion. Please try again.');
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/poll/${poll.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEditLink = async () => {
    const url = `${window.location.origin}/poll/${poll.id}?token=${poll.editToken}`;
    await navigator.clipboard.writeText(url);
    setCopiedEdit(true);
    toast.success('Edit link copied! Keep this private.');
    setTimeout(() => setCopiedEdit(false), 2000);
  };

  const sortedSuggestions = [...poll.suggestions].sort((a, b) => b.votes - a.votes);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link to="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        
        {isEditable && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
            <Settings className="h-4 w-4" />
            Edit Mode
          </div>
        )}
      </motion.div>

      <GlassCard hover={false} className="p-8">
        <div className="mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold font-display gradient-text mb-2"
          >
            {poll.title}
          </motion.h1>
          {poll.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg"
            >
              {poll.description}
            </motion.p>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mt-4 pt-4 border-t border-border"
          >
            <span className="text-sm text-muted-foreground">
              {poll.totalVotes} total {poll.totalVotes === 1 ? 'vote' : 'votes'}
            </span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {poll.suggestions.length} {poll.suggestions.length === 1 ? 'suggestion' : 'suggestions'}
            </span>
          </motion.div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="gap-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Share Poll'}
          </Button>
          
          {isEditable && (
            <Button
              variant="outline"
              onClick={handleCopyEditLink}
              className="gap-2"
            >
              {copiedEdit ? <Check className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
              {copiedEdit ? 'Copied!' : 'Copy Edit Link'}
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Input
              placeholder="Add a new suggestion..."
              value={newSuggestion}
              onChange={(e) => setNewSuggestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddSuggestion();
              }}
              className="flex-1"
            />
            <Button onClick={handleAddSuggestion} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          <AnimatePresence mode="popLayout">
            {sortedSuggestions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-muted-foreground"
              >
                <p className="text-lg">No suggestions yet</p>
                <p className="text-sm">Be the first to add one!</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {sortedSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SuggestionItem
                      id={suggestion.id}
                      text={suggestion.text}
                      votes={suggestion.votes}
                      totalVotes={poll.totalVotes}
                      onVote={() => handleVote(suggestion.id)}
                      onDelete={isEditable ? async () => {
                        try {
                          await apiClient.deleteSuggestion(poll.id, suggestion.id);
                          deleteSuggestion(poll.id, suggestion.id);
                          toast.success('Suggestion deleted');
                        } catch (error) {
                          console.error('Failed to delete:', error);
                          toast.error('Failed to delete suggestion');
                        }
                      } : undefined}
                      onEdit={isEditable ? async (text) => {
                        try {
                          await apiClient.updateSuggestion(poll.id, suggestion.id, text);
                          updateSuggestion(poll.id, suggestion.id, text);
                          toast.success('Suggestion updated');
                        } catch (error) {
                          console.error('Failed to update:', error);
                          toast.error('Failed to update suggestion');
                        }
                      } : undefined}
                      isEditable={isEditable}
                      hasVoted={votedIds.has(suggestion.id)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </div>
  );
}
