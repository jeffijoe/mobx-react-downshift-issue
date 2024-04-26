# Downshift + MobX-React issue

This repository is a reproduction of a bug is caused by `downshift` but is made worse by a (potential?) other bug in `mobx-react`.

**TL;DR**: In `downshift`, the `onSelectedItemChange` handler is called twice under certain conditions but in the same batch. . In `mobx-react`, this can result in continuously
enqueueing more work on the internal React sync queue, leading to a `Max update depth` React error.

> In my actual project, the `Max update depth` error is triggering in an infinite loop, effectively freezing the browser. I was unable to reproduce that here though.

- `npm run dev` to start the dev server; runs on http://localhost:5173 - to view the MobX version, add `?mobx` to the URL.
- `npm test` to run the Playwright test case.

Edit `src/run-playwright.js` and uncomment the `delay: 10` to show that it works with a delay. You can also uncomment the `onMouseMove={() => {}}` handler on the `<li>`, which will also make it work.

The root cause is `downshift` triggers `onSelectedItemChange` twice when the item's `onClick` and `onMouseMove` happens in the same frame. This is practically impossible to pull off with a physical device, but browser automation like Playwright is able to move the pointer and trigger a click in a single frame.

Usually this wouldn't be so bad, however when using MobX to manage the combobox's state and `mobx-react` **version 8 or above**, the `Max update depth` React error is triggered. This happens when the callback that sets the state causes a reaction on each invocation. I'm assuming this has something to do with the switch to `useSyncExternalStore` which essentially "fixed" the use of React batched updates on the MobX side.
