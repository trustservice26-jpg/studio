'use client';

import { useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';

import { suggestMemberRoles, SuggestMemberRolesOutput } from '@/ai/flows/suggest-member-roles';
import type { Member } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type RoleAdvisorModalProps = {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RoleAdvisorModal({ member, open, onOpenChange }: RoleAdvisorModalProps) {
  const [contributions, setContributions] = useState(member.contributions);
  const [suggestion, setSuggestion] = useState<SuggestMemberRolesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSuggestRoles = async () => {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await suggestMemberRoles({ memberContributions: contributions });
      setSuggestion(result);
    } catch (error) {
      console.error('Error suggesting roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Role Advisor for {member.name}</DialogTitle>
          <DialogDescription>
            Based on the member's contributions, AI can suggest suitable roles within the organization.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label htmlFor="contributions" className="text-sm font-medium">
              Member Contributions
            </label>
            <Textarea
              id="contributions"
              value={contributions}
              onChange={(e) => setContributions(e.target.value)}
              className="mt-1 min-h-[120px]"
            />
          </div>
          {isLoading && (
            <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {suggestion && (
            <Card className="bg-accent/50">
              <CardHeader>
                <CardTitle className="text-lg">Suggested Roles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {suggestion.suggestedRoles.map((role) => (
                    <Badge key={role} variant="default">{role}</Badge>
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold">Reasoning</h4>
                  <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSuggestRoles} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Suggest Roles
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
