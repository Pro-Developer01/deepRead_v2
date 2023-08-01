module.exports = {
    // ... other webpack configurations ...
    // this one should specifically counter the Watchpack Error (watcher): Error: ENOSPC: System limit ...
    watchOptions: {
      ignored: /node_modules/,
    },
  };
  