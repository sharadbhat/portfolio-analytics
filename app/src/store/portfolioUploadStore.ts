import axios from "axios";
import type { FileWithPath } from "@mantine/dropzone";
import { create } from "zustand";
import { SUBMIT_URL } from "../config";
import type {
  PortfolioAnalytics,
  PortfolioAnalyticsResponse,
  SampleCsv,
  SampleHolding,
} from "../types/portfolio";

type PortfolioUploadState = {
  selectedFile: FileWithPath | null;
  fileError: string | null;
  successMessage: string | null;
  isSubmitting: boolean;
  analytics: PortfolioAnalytics | null;
  handleDrop: (files: FileWithPath[]) => void;
  handleReject: () => void;
  analyzePortfolio: () => Promise<void>;
  analyzeSampleCsv: (sample: SampleCsv) => Promise<void>;
};

function serializeSampleRows(rows: SampleHolding[]) {
  const header = "ticker,quantity,avg_buy_price";
  const lines = rows.map(
    (row) => `${row.ticker},${row.quantity},${row.avgBuyPrice.toFixed(2)}`,
  );
  return [header, ...lines].join("\n");
}

async function submitCsvText(csvText: string) {
  const response = await axios.post<PortfolioAnalyticsResponse>(SUBMIT_URL, csvText, {
    headers: {
      "Content-Type": "text/csv",
    },
  });

  return response.data.analytics;
}

export const usePortfolioUploadStore = create<PortfolioUploadState>(
  (set, get) => ({
    selectedFile: null,
    fileError: null,
    successMessage: null,
    isSubmitting: false,
    analytics: null,
    handleDrop: (files) =>
      set({
        selectedFile: files[0] ?? null,
        fileError: null,
        successMessage: null,
        analytics: null,
      }),
    handleReject: () =>
      set({
        selectedFile: null,
        fileError: "Please upload a CSV file under 5 MB.",
        successMessage: null,
        analytics: null,
      }),
    analyzePortfolio: async () => {
      const { selectedFile } = get();

      if (!selectedFile) {
        set({
          fileError: "Please select a CSV file to analyze.",
          successMessage: null,
        });
        return;
      }

      try {
        set({
          isSubmitting: true,
          fileError: null,
          successMessage: null,
          analytics: null,
        });

        const csvText = await selectedFile.text();

        if (!csvText.trim()) {
          set({
            fileError: "The selected CSV file is empty.",
            successMessage: null,
            isSubmitting: false,
            analytics: null,
          });
          return;
        }

        const analytics = await submitCsvText(csvText);

        set({
          analytics,
          successMessage: "Portfolio submitted successfully.",
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const apiError = error.response?.data?.error;
          set({
            fileError:
              apiError ??
              `Unable to submit portfolio. Make sure the API is reachable at ${SUBMIT_URL}.`,
            successMessage: null,
            analytics: null,
          });
        } else {
          set({
            fileError: "Unable to submit portfolio right now.",
            successMessage: null,
            analytics: null,
          });
        }
      } finally {
        set({ isSubmitting: false });
      }
    },
    analyzeSampleCsv: async (sample) => {
      try {
        set({
          isSubmitting: true,
          fileError: null,
          successMessage: null,
          analytics: null,
        });

        const csvText = serializeSampleRows(sample.rows);
        const sampleFile = new File([csvText], sample.fileName, {
          type: "text/csv",
        }) as FileWithPath;

        set({ selectedFile: sampleFile });

        const analytics = await submitCsvText(csvText);

        set({
          analytics,
          successMessage: `${sample.title} submitted successfully.`,
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const apiError = error.response?.data?.error;
          set({
            fileError:
              apiError ??
              `Unable to submit sample portfolio. Make sure the API is reachable at ${SUBMIT_URL}.`,
            successMessage: null,
            analytics: null,
          });
        } else {
          set({
            fileError: "Unable to submit sample portfolio right now.",
            successMessage: null,
            analytics: null,
          });
        }
      } finally {
        set({ isSubmitting: false });
      }
    },
  }),
);
