# docker-image-tag-generator

This Github Action creates a Docker image tag from a git branch and commit hash.

## Inputs

### `branch`
The git branch name, e.g.
  * `master`
  * `kn/branch-name`

### `sha`
The commit hash, e.g.
  * `2bf07c82`
  * `2bf07c82e1557182582275575c2510f85b6da00b`

These should be sourced directly from the [`github` context](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context) within Github Actions - see example below.

## Outputs

### `docker-image-tag`

e.g.
* `master-12345678`
* `staging-12345678`
* `gm-new-api-schema-12345678`

## How to use

Example `step` within a workflow:

```yaml
- name: Generate Docker image tag
  uses: boost/docker-image-tag-generator@v1.0.0
  id: docker-image-tagger # This allows you to reference this step subsequently
  with:
    # Setting `branch` and `sha` directly from the Github Actions `github` context
    branch: ${{github.head_ref}}
    sha: ${{github.event.pull_request.head.sha}}
```

Fuller example, showing how the tag is used in the Docker image creation:

```yaml
- name: Generate Docker image tag
  uses: boost/docker-image-tag-generator@v1.0.0
  id: docker-image-tagger
  with:
    branch: ${{github.head_ref}}
    sha: ${{github.event.pull_request.head.sha}}

- name: Build & tag Docker image
  env:
    TAG: ${{steps.docker-image-tagger.outputs.docker-image-tag}}
    ECR_REPOSITORY: your-repository-name
    AWS_ACCOUNT_ID: 123456789
    AWS_REGION: ap-southeast-2
  run: |
    docker build -t ${{env.ECR_REPOSITORY}}:${{env.TAG}} --build-arg RAILS_ENV=staging .
    docker tag ${{env.ECR_REPOSITORY}}:${{env.TAG}} {{env.AWS_ACCOUNT_ID}}.dkr.ecr.{{env.AWS_REGION}}.amazonaws.com/${{env.ECR_REPOSITORY}}:${{env.TAG}}
```

## Credit

This code was written by [Andy Gray](https://github.com/mrGrazy) at [Boost](https://github.com/boost).
