# Finance & Accounting – Remotion Stock Video (5s, MP4)

## Setup
    npm install
    npm run dev         # live preview in Chrome (Remotion Studio)

## Render
    npm run render      # 1920x1080 MP4 -> out/finance-accounting-hd.mp4
    npm run render:4k   # 3840x2160 MP4 -> out/finance-accounting-4k.mp4  (best for Adobe Stock)
    npm run still       # thumbnail PNG

Specs: H.264, yuv420p, 30 fps, 5.0 s, no audio, no text/logos (stock safe).
Chrome plays/downloads the MP4 natively. Remotion Studio also has a Render button.

## Adobe Stock upload
Upload the MP4, then paste Title / Keywords from adobe-stock-metadata.csv
(or import the CSV in the Contributor portal). Category: Business.

## GitHub Actions (render di cloud)
Push project ke GitHub -> tab Actions -> "Render Finance Video" -> Run workflow.
Setelah selesai, download MP4 dari bagian Artifacts.
