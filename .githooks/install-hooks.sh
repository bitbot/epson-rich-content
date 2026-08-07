#!/bin/sh
# .githooks/install-hooks.sh — arm this clone's versioned git hooks.
#
# The hooks in .githooks/ are versioned, but git does not run them until this
# clone points core.hooksPath at that directory. That setting is per-clone local
# config; nothing in the repo can set it for you, which is why every fresh clone
# has to run this once.
#
#   sh .githooks/install-hooks.sh
#
# Equivalent one-liner:  git config core.hooksPath .githooks

set -eu

HOOK_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
REPO_ROOT=$(CDPATH= cd -- "$HOOK_DIR/.." && pwd)

cd "$REPO_ROOT"
git config core.hooksPath .githooks

echo "Armed: core.hooksPath = $(git config core.hooksPath)"
echo "Repo:  $REPO_ROOT"
echo ""
echo "git push now runs .githooks/pre-push (secrets scan)."
echo "Knowing human override: git push --no-verify — flag it when you use it."
