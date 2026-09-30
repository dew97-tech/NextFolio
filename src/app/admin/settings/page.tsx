import { listModels } from "@/app/lib/ai/models";
import {
  getGenerationSettings,
  getImageSettings,
  getReviewSettings,
} from "@/app/lib/settings";
import AiModelSettings from "@/app/ui/ai-model-settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [generation, review, image] = await Promise.all([
    getGenerationSettings(),
    getReviewSettings(),
    getImageSettings(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl tracking-[-0.01em] text-foreground">
          AI settings
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Choose the OpenCode Go models used for generation, review, and cover
          prompts. The generation chain is tried in order until a draft passes
          validation.
        </p>
      </div>

      <AiModelSettings
        models={listModels()}
        generation={generation}
        review={review}
        image={image}
        apiKeyConfigured={Boolean(process.env.OPENCODE_GO_API_KEY)}
      />
    </div>
  );
}
