import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setText, generateSummary } from "../features/summarySlice";
import { saveSummary, fetchHistory } from "../features/historySlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { text, summary, loading: summaryLoading } = useSelector(
    (state) => state.summary
  );
  const { items: history, loading: historyLoading } = useSelector(
    (state) => state.history
  );

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchHistory(user.uid));
    }
  }, [user, dispatch]);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    const res = await dispatch(generateSummary(text));
    if (res.meta.requestStatus === "fulfilled" && user?.uid) {
      await dispatch(
        saveSummary({
          uid: user.uid,
          text,
          summary: res.payload,
        })

      );
      dispatch(fetchHistory(user.uid));
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Left side: Input + summary */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Generate Summary</h2>
        <textarea
          className="w-full border rounded p-2 h-40 mb-3"
          placeholder="Paste or type your text here..."
          value={text}
          onChange={(e) => dispatch(setText(e.target.value))}
        />
        <button
          onClick={handleGenerate}
          disabled={summaryLoading}
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold disabled:opacity-60"
        >
          {summaryLoading ? "Generating..." : "Generate Summary"}
        </button>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Summary</h3>
          {summary ? (
            <p className="border rounded p-3 bg-gray-50 text-sm">{summary}</p>
          ) : (
            <p className="text-sm text-gray-500">
              Your generated summary will appear here.
            </p>
          )}
        </div>
      </div>

      {/* Right side: History */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">History</h2>
        {historyLoading ? (
          <p>Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-gray-500">
            No summaries yet. Generate one to see it here.
          </p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {history.map((item) => (
              <div
                key={item.id}
                className="border rounded p-3 text-sm bg-gray-50"
              >
                <p className="font-semibold mb-1">Original:</p>
                <p className="line-clamp-3 mb-2">{item.text}</p>
                <p className="font-semibold mb-1">Summary:</p>
                <p className="mb-2">{item.summary}</p>
                {item.createdAt && item.createdAt.toDate && (
                  <p className="text-xs text-gray-500">
                    {item.createdAt.toDate().toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
