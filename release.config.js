module.exports = {
  branches: [
    'main'
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer', // Analyzes commits for version bumping
      {
        releaseRules: [
          { type: 'perf', release: 'minor' }, // perf commits bump minor (default is patch); other types keep default rules
          { type: 'docs', scope: 'readme', release: 'patch' } // readme is the npm showcase - republish so npmjs.com picks it up
        ]
      }
    ],
    '@semantic-release/release-notes-generator', // Generates release notes
    '@semantic-release/changelog', // Generates the changelog
    [
      '@semantic-release/npm',
      {
        npmPublish: true
      }
    ],
    '@semantic-release/github', // Handles GitHub releases
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  ]
};