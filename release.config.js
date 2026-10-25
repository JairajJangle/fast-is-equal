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
    [
      '@semantic-release/release-notes-generator', // Generates release notes
      {
        // Every commit type is listed so a release never gets empty notes
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: 'Features' },
            { type: 'fix', section: 'Bug Fixes' },
            { type: 'perf', section: 'Performance Improvements' },
            { type: 'revert', section: 'Reverts' },
            { type: 'docs', section: 'Documentation' },
            { type: 'refactor', section: 'Code Refactoring' },
            { type: 'build', section: 'Build System' },
            { type: 'chore', section: 'Miscellaneous Chores' },
            { type: 'ci', section: 'Continuous Integration' },
            { type: 'test', section: 'Tests' },
            { type: 'style', section: 'Styles' },
          ],
        },
      },
    ],
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