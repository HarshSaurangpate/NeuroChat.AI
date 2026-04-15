import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

/** Renders a single chat message bubble — user (right) or assistant (left). */
export default function MessageBubble({ message, isStreaming = false }) {
  const isUser = message.role === 'user';

  return (
  <div
    className={`flex items-start gap-3 px-4 py-3 animate-fade-in ${
      isUser ? 'flex-row-reverse' : 'flex-row'
    }`}
  >
    {/* Avatar */}
    <div
      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
        ${
          isUser
            ? 'bg-[#343e3c] text-white'
            : 'bg-[#23282f] text-[#e6edf3]'
        }`}
    >
      {isUser ? 'U' : 'N'}
    </div>

    {/* Bubble */}
    <div
      className={`max-w-[75%] md:max-w-[65%] px-4 py-3 text-sm leading-relaxed
        ${
          isUser
            ? 'bg-[#272b2a] text-white rounded-2xl rounded-tr-sm'
            : 'bg-transparent text-[#e6edf3]'
        }`}
    >
      {isUser ? (
        <p className="whitespace-pre-wrap">{message.content}</p>
      ) : (
        <div className="prose-chat text-sm text-[#e6edf3]">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <CodeBlock language={match[1]} code={String(children).replace(/\n$/, '')} />
                ) : (
                  <code className="bg-[#21262d] px-1 py-0.5 rounded text-[#e6edf3]" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>

          {/* Blinking cursor while streaming */}
          {isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-[#2d3432] ml-0.5 animate-pulse" />
          )}
        </div>
      )}

      {/* Timestamp */}
      <p
        className={`text-[10px] mt-1.5 ${
          isUser ? 'text-white/70' : 'text-[#8b949e]'
        }`}
      >
        {new Date(message.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    </div>
  </div>
);
}

/** Code block with language label + copy button */
function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl overflow-hidden my-3 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.8rem' }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
