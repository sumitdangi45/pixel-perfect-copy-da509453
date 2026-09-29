<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep this screenshot-inspired contact experience on the `/contact` route (home page lives elsewhere; `/` redirects to `/contact`), with visual tokens in `src/styles.css` and shared button variants in `src/components/ui/button.tsx`, so layout and controls stay consistent.
- Keep screenshot review on a separate editor route and validate image uploads on the server before sending them to the AI Gateway, so the public contact page stays focused and uploads cannot be sent blindly.
- Require a signed-in account for editor screenshot analysis, so the paid AI endpoint is not an open anonymous service.
