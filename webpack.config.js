const path = require('path');
const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);

const configs = async () => {
  const isDevelopment = 'production' !== 'production';
  const clientFolderPath = path.join(__dirname, 'src', 'client');
  const serverFolderPath = path.join(__dirname, 'src', 'server');

  const clientFiles = await readdir(clientFolderPath);
  const serverFiles = await readdir(serverFolderPath);

  const clientPaths = clientFiles.map((file) =>
    path.resolve(__dirname, 'src', 'client', file)
  );

  const serverPaths = serverFiles.map((file) =>
    path.resolve(__dirname, 'src', 'server', file)
  );

  return {
    mode: isDevelopment ? 'development' : 'production',
    entry: {
      client: clientPaths,
      server: serverPaths,
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../', 'dist'),
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [
                isDevelopment && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
  };
};

module.exports = configs;
