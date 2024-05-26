<template>
  <HorizontalCollapse v-model:expanded="isExpanded">
    <div
      v-loading="mainStore.isLoadingReport"
      class="general-wrapper"
    >
      <template v-if="mainStore.mode === 'ci'">
        <h4>Github Repository</h4>
        <div class="general-wrapper__cell">
          <img
            src="@/assets/images/github.png"
            height="20"
          />
          <a
            :href="pullRequest.repoUrl"
            target="_blank"
          >
            {{ pullRequest.repoName }}
          </a>
        </div>

        <div class="general-wrapper__cell">
          <img
            :src="pullRequest.authorAvatar"
            width="20"
            style="border-radius: 4px"
          />
          <span
            :href="pullRequest.url"
            target="_blank"
          >
            <a
              :href="pullRequest.authorUrl"
              target="_blank"
              >{{ pullRequest.author }}</a
            >
            pushed
          </span>
        </div>

        <div class="general-wrapper__cell head-branch">
          <BaseIcon name="branch" />
          <code>
            {{ pullRequest.branch }}
          </code>
        </div>

        <div class="general-wrapper__cell target-branch">
          <BaseIcon
            name="right-chevron"
            style="color: var(--color-text)"
          />
          <code style="margin-left: -0.5rem">
            {{ pullRequest.targetBranch }}
          </code>
        </div>

        <div class="general-wrapper__cell">
          <BaseIcon name="pull-request" />
          <a
            :href="pullRequest.url"
            target="_blank"
          >
            See pull request
          </a>
        </div>

        <div class="general-wrapper__cell">
          <BaseIcon name="commit" />
          <a
            :href="pullRequest.commitUrl"
            target="_blank"
          >
            Commit
            {{ pullRequest.commitHash.slice(0, 7) }}
          </a>
        </div>
      </template>

      <template v-if="mainStore.report">
        <h4>Browser</h4>

        <div class="general-wrapper__cell">
          <template v-if="browser">
            <img
              :src="browserIconMap[browser]"
              height="20"
            />
            <span>{{ browser }}</span>
          </template>
        </div>

        <div class="general-wrapper__cell">
          <template v-if="browser">
            <BaseIcon name="version" />
            <span>{{ mainStore.report.browserVersion }}</span>
          </template>
        </div>

        <h4>Cypress</h4>

        <div class="general-wrapper__cell">
          <img
            src="@/assets/images/cypress.png"
            height="20"
          />
          <span>{{ mainStore.report.cypressVersion }}</span>
        </div>
      </template>

      <el-button
        type="primary"
        plain
        class="collapse-button"
        @click="isExpanded = !isExpanded"
      >
        <BaseIcon
          name="right-chevron"
          width="15"
          :style="{ transform: 'rotate(180deg)' }"
        />
      </el-button>
    </div>
  </HorizontalCollapse>

  <div
    v-if="!isExpanded"
    class="expand-bar"
  >
    <el-button
      type="primary"
      plain
      @click="isExpanded = true"
    >
      <BaseIcon
        name="right-chevron"
        width="15"
      />
    </el-button>
  </div>
</template>

<script lang="ts">
export type Browser = 'chrome' | 'edge' | 'firefox' | 'safari' | 'electron'

export interface PullRequestInstance {
  url: string
  repoName: string
  repoUrl: string
  branch: string
  author: string
  authorAvatar: string
  authorUrl: string
  targetBranch: string
  commitHash: string
  commitUrl: string
}
</script>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

import { useMainStore } from '@/store'
import { DetailsUrlQuery } from '@commonTypes'
import chrome from '@/assets/images/chrome.png'
import edge from '@/assets/images/edge.png'
import firefox from '@/assets/images/firefox.png'
import safari from '@/assets/images/safari.png'
import electron from '@/assets/images/electron.png'

const mainStore = useMainStore()
const route = useRoute()
const isExpanded = ref(true)

const pullRequest = computed<PullRequestInstance>(() => {
  const { pullNumber, owner, repo, ref, sha, targetRef, author, authorAvatar } =
    route.query as unknown as DetailsUrlQuery
  return {
    url: `https://github.com/${owner}/${repo}/pull/${pullNumber}`,
    repoName: `${owner}/${repo}`,
    repoUrl: `https://github.com/${owner}/${repo}`,
    branch: ref,
    targetBranch: targetRef,
    commitHash: sha,
    commitUrl: `https://github.com/${owner}/${repo}/pull/${pullNumber}/commits/${sha}`,
    author,
    authorAvatar,
    authorUrl: `https://github.com/${owner}`
  }
})

const browserIconMap: Record<Browser, string> = {
  chrome,
  edge,
  firefox,
  safari,
  electron
}

const browser = computed(() => {
  return (Object.keys(browserIconMap) as Browser[]).find((key) =>
    mainStore.report?.browserName.toLowerCase().includes(key)
  )
})
</script>

<style scoped>
.general-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 1rem 1rem 0 0;
  background-color: var(--color-background-el);
  padding: 0.8rem 1.8rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: var(--color-text-secondary);

  border-right: 1.5rem solid var(--color-background-mute);
  width: 30rem;
  min-width: 30rem;
}

.general-wrapper a {
  color: var(--color-primary);
}

.general-wrapper > h4:not(:first-child) {
  margin-top: 3rem;
}
.general-wrapper__cell {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}
.general-wrapper__cell.head-branch {
  position: relative;
}
.general-wrapper__cell.target-branch {
  margin-left: 2.5rem;
}
.general-wrapper__cell.head-branch:before {
  content: '';
  border-left: 2px dotted var(--color-text-secondary);
  border-bottom: 2px dotted var(--color-text-secondary);
  position: absolute;
  bottom: -2.1rem;
  left: 0.8rem;
  height: 100%;
  width: 1.5rem;
}
.general-wrapper__cell > code {
  background-color: var(--color-background-mute);
  padding: 0 2px;
  border-radius: 0.5rem;
}

.collapse-button {
  width: min-content;
  padding: 0rem;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}
.expand-bar {
  width: min-content;
  background-color: var(--color-background-mute);
  display: flex;
  align-items: end;
  padding-bottom: 1rem;
  border-radius: 1rem 1rem 0 0;
}
.expand-bar > .el-button {
  padding: 0;
}
</style>
