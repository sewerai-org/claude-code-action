import { describe, expect, test } from "bun:test";
import { buildAllowedToolsString, generatePrompt } from "../src/create-prompt";

describe("Inline Comments", () => {
  describe("Tool availability", () => {
    test("should include inline comment tool in allowed tools", () => {
      const allowedTools = buildAllowedToolsString([]);
      expect(allowedTools).toContain(
        "mcp__github_file_ops__create_inline_comment",
      );
    });
  });

  describe("Prompt generation", () => {
    test("should include inline comment instructions for PR events", () => {
      const mockContext = {
        repository: "test/repo",
        claudeCommentId: "123",
        triggerPhrase: "@claude",
        triggerUsername: "testuser",
        eventData: {
          eventName: "pull_request_review",
          isPR: true,
          prNumber: "1",
          commentBody: "Please review this code",
        },
      };

      const mockGitHubData = {
        contextData: {
          title: "Test PR",
          body: "Test body",
          author: { login: "testuser" },
          state: "OPEN",
          commits: { totalCount: 1 },
          files: { nodes: [] },
        },
        comments: [],
        changedFilesWithSHA: [],
        reviewData: [],
        imageUrlMap: new Map(),
      };

      const prompt = generatePrompt(mockContext, mockGitHubData);

      expect(prompt).toContain("INLINE COMMENTS");
      expect(prompt).toContain("mcp__github_file_ops__create_inline_comment");
      expect(prompt).toContain("Single-line comment example");
      expect(prompt).toContain("Multi-line comment example");
    });

    test("should not include inline comment instructions for issue events", () => {
      const mockContext = {
        repository: "test/repo",
        claudeCommentId: "123",
        triggerPhrase: "@claude",
        triggerUsername: "testuser",
        eventData: {
          eventName: "issues",
          isPR: false,
          issueNumber: "1",
        },
      };

      const mockGitHubData = {
        contextData: {
          title: "Test Issue",
          body: "Test body",
          author: { login: "testuser" },
          state: "OPEN",
        },
        comments: [],
        changedFilesWithSHA: [],
        reviewData: [],
        imageUrlMap: new Map(),
      };

      const prompt = generatePrompt(mockContext, mockGitHubData);

      expect(prompt).not.toContain("INLINE COMMENTS");
      expect(prompt).not.toContain("Single-line comment example");
    });
  });
});
