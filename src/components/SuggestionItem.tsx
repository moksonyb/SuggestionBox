import { motion } from 'framer-motion';
import { ThumbsUp, Trash2, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SuggestionItemProps {
  id: string;
  text: string;
  votes: number;
  totalVotes: number;
  onVote: () => void;
  onDelete?: () => void;
  onEdit?: (text: string) => void;
  isEditable?: boolean;
  hasVoted?: boolean;
}

export function SuggestionItem({
  text,
  votes,
  totalVotes,
  onVote,
  onDelete,
  onEdit,
  isEditable = false,
  hasVoted = false,
}: SuggestionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  
  const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  
  const handleSave = () => {
    if (editText.trim() && onEdit) {
      onEdit(editText.trim());
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    setEditText(text);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30"
    >
      {/* Progress bar background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      />
      
      <div className="relative z-10 flex items-center gap-4">
        {isEditing ? (
          <div className="flex flex-1 items-center gap-2">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <Button size="icon" variant="ghost" onClick={handleSave} className="text-success">
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleCancel} className="text-destructive">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <p className="font-medium text-foreground">{text}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.span
                key={votes}
                initial={{ scale: 1.5, color: 'hsl(var(--primary))' }}
                animate={{ scale: 1, color: 'hsl(var(--muted-foreground))' }}
                className="min-w-[3rem] text-right text-sm font-semibold"
              >
                {votes} {votes === 1 ? 'vote' : 'votes'}
              </motion.span>
              
              <Button
                size="sm"
                variant={hasVoted ? "default" : "outline"}
                onClick={onVote}
                className={cn(
                  "gap-1 transition-all",
                  hasVoted && "bg-primary text-primary-foreground"
                )}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              
              {isEditable && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onDelete}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
      
      {!isEditing && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      )}
    </motion.div>
  );
}
