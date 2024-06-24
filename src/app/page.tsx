"use client";
import React, { useState } from "react";
import {
  MessageSquare,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Eye,
  EyeOff,
  Send,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SocialCommentPlatform = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(true);
  const [selectedText, setSelectedText] = useState("");
  const [selectedQA, setSelectedQA] = useState(null);
  const [publicQAs, setPublicQAs] = useState<
    { id: number; question: string; answer: string; comments: any[] }[]
  >([
    {
      id: 1,
      question: "What is the capital of France?",
      answer: "The capital of France is Paris.",
      comments: [],
    },
    {
      id: 2,
      question: "How does photosynthesis work?",
      answer:
        "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of sugar.",
      comments: [],
    },
  ]);

  const handleAskQuestion = () => {
    // Simulating LLM response
    setAnswer(
      "This is a sample answer from the LLM. You can highlight parts of this text to add comments. The answer provides detailed information about the topic, addressing various aspects and potential follow-up questions."
    );
  };

  const handleShare = () => {
    const newQA = { id: publicQAs.length + 1, question, answer, comments: [] };
    setPublicQAs([newQA, ...publicQAs]);
    setActiveTab("public");
  };

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
    }
  };

  const handleAddComment = (comment: any, qaId = null) => {
    const newComment = {
      id: Date.now(),
      text: comment,
      author: "User",
      timestamp: new Date().toISOString(),
      votes: 0,
      userVote: null,
      saved: false,
    };
    if (qaId) {
      setPublicQAs((prevQAs) =>
        prevQAs.map((qa) =>
          qa.id === qaId
            ? { ...qa, comments: [newComment, ...qa.comments] }
            : qa
        )
      );
      if (selectedQA && (selectedQA as any).id === qaId) {
        setSelectedQA((prevQA: any) => {
          if (prevQA) {
            return {
              ...prevQA,
              comments: [newComment, ...prevQA.comments],
            };
          }
          return null;
        });
      }
    } else {
      setComments((prevComments) => [newComment, ...prevComments]);
    }
  };

  const handleVote = (commentId: any, voteType: string, qaId = null) => {
    const updateComment = (comment: any) => {
      if (comment.id === commentId) {
        let newVotes = comment.votes;
        if (comment.userVote === voteType) {
          // Undo the vote
          newVotes += voteType === "up" ? -1 : 1;
          return { ...comment, votes: newVotes, userVote: null };
        } else {
          // Change vote or new vote
          newVotes += voteType === "up" ? 1 : -1;
          if (comment.userVote) newVotes += comment.userVote === "up" ? -1 : 1;
          return { ...comment, votes: newVotes, userVote: voteType };
        }
      }
      return comment;
    };

    if (qaId) {
      setPublicQAs((prevQAs) =>
        prevQAs.map((qa) =>
          qa.id === qaId
            ? { ...qa, comments: qa.comments.map(updateComment) }
            : qa
        )
      );
      if (selectedQA && (selectedQA as any).id === qaId) {
        setSelectedQA(
          (prevQA: any) =>
            ({
              ...prevQA,
              comments: prevQA.comments.map(updateComment),
            } as any)
        );
      }
    } else {
      setComments((prevComments) => prevComments.map(updateComment));
    }
  };

  const handleSave = (commentId: any, qaId = null) => {
    const updateComment = (comment: any) =>
      comment.id === commentId
        ? { ...comment, saved: !comment.saved }
        : comment;

    if (qaId) {
      setPublicQAs((prevQAs) =>
        prevQAs.map((qa) =>
          qa.id === qaId
            ? { ...qa, comments: qa.comments.map(updateComment) }
            : qa
        )
      );
      if (selectedQA && (selectedQA as any).id === qaId) {
        setSelectedQA(
          (prevQA: any) =>
            ({
              ...prevQA,
              comments: prevQA.comments.map(updateComment),
            } as any)
        );
      }
    } else {
      setComments((prevComments) => prevComments.map(updateComment));
    }
  };

  const CommentSection = ({
    comments,
    onAddComment,
    qaId = null,
  }: {
    comments: any[];
    onAddComment: any;
    qaId?: number | null;
  }) => {
    const [newComment, setNewComment] = useState("");

    const handleSubmit = () => {
      if (newComment.trim()) {
        onAddComment(newComment, qaId);
        setNewComment("");
      }
    };

    return (
      <div className="mt-4 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        {comments.map((comment: any) => (
          <div key={comment.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback>{comment.author[0]}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{comment.author}</span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(comment.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-700">{comment.text}</p>
            <div className="mt-2 flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(comment.id, "up", qaId as any)}
                className={comment.userVote === "up" ? "text-green-500" : ""}
              >
                <ThumbsUp className="h-4 w-4 mr-1" /> {comment.votes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(comment.id, "down", qaId as any)}
                className={comment.userVote === "down" ? "text-red-500" : ""}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSave(comment.id, qaId as any)}
                className={comment.saved ? "text-blue-500" : ""}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <div className="flex items-center mt-4">
          <Input
            placeholder="Add your comment..."
            className="flex-grow mr-2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button onClick={handleSubmit}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const QADetailView = ({ qa, onBack }: { qa: any; onBack: () => void }) => (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Public Square
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{qa.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{qa.answer}</p>
        </CardContent>
      </Card>
      <CommentSection
        comments={qa.comments}
        onAddComment={handleAddComment}
        qaId={qa.id}
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="public">Public Square</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Input
                  placeholder="Type your question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-grow mr-2"
                />
                <Button onClick={handleAskQuestion}>Ask LLM</Button>
              </div>
            </CardContent>
          </Card>

          {answer && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>LLM Answer</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className="text-gray-700 leading-relaxed"
                  onMouseUp={handleHighlight}
                >
                  {answer}
                </p>
              </CardContent>
              <CardFooter className="justify-between">
                <Button onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" /> Share to Public Square
                </Button>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={showComments}
                    onCheckedChange={setShowComments}
                  />
                  <span>Show Comments</span>
                </div>
              </CardFooter>
            </Card>
          )}

          {showComments && (
            <CommentSection
              comments={comments}
              onAddComment={handleAddComment}
            />
          )}
        </TabsContent>

        <TabsContent value="public">
          {selectedQA ? (
            <QADetailView qa={selectedQA} onBack={() => setSelectedQA(null)} />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {publicQAs.map((qa) => (
                <Card
                  key={qa.id}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{qa.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3">{qa.answer}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="ml-auto"
                      onClick={() => setSelectedQA(qa as any)}
                    >
                      View <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialCommentPlatform;
