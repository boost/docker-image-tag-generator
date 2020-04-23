const core = require('@actions/core');

try {
  const branch = core.getInput('branch').replace(/^refs\/(tags|heads)\//,'');
  const sha = core.getInput('sha')

  const safeBranch = branch.replace(/[^a-z0-9]/g, '-')
  const shortSha = sha.slice(0,8)

  const tag = `${safeBranch}-${shortSha}`

  console.log(`tag: ${tag}`)
  core.setOutput('docker-image-tag', tag);
} catch (error) {
  core.setFailed(error.message);
}
