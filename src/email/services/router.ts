import { GmailProvider } from "../providers/gmail.provider";
import { OutlookProvider } from "../providers/outlook.provider";
import { MailProvider } from "../providers/provider.interface";

import { isHealthy, markUnhealthy } from "./providerHealth";

import { isPermanentError, isNetworkError } from "../utils/errorClassifier";

const providers: MailProvider[] = [GmailProvider, OutlookProvider];

export async function sendWithFallback(
  to: string,
  subject: string,
  html: string,
) {
  let lastError: any;

  for (const provider of providers) {
    const healthy = await isHealthy(provider.name);

    if (!healthy) {
      console.warn(`⏭️ Skipping ${provider.name} (unhealthy)`);
      continue;
    }

    try {
      await provider.send(to, subject, html);

      console.log(`📨 Sent via ${provider.name}`);

      return;
    } catch (err: any) {
      lastError = err;

      console.error(`❌ ${provider.name} failed:`, err.message);

      /* -------- Permanent failure -------- */
      if (isPermanentError(err)) {
        console.warn(`🚫 ${provider.name} disabled (permanent error)`);

        await markUnhealthy(provider.name, 3600); // 1h

        continue;
      }

      /* -------- Network / temp failure -------- */
      if (isNetworkError(err)) {
        console.warn(`⚠️ ${provider.name} degraded (network)`);

        await markUnhealthy(provider.name, 300); // 5 min

        continue;
      }

      /* -------- Unknown -------- */
      await markUnhealthy(provider.name, 180);

      continue;
    }
  }

  throw lastError;
}
