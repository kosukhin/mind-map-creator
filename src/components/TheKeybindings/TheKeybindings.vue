<script lang="ts" setup>
import { SHOW_KEYBINDINGS } from '@/constants/overlays';
import { overlayController } from '@/modulesHigh/overlay/overlayController';

overlayController.autoClose(SHOW_KEYBINDINGS);
</script>

<template>
  <pre class="TheKeybindings">
    Esc - {{ $t('general.closeModal') }}
    Ctrl+<em>S</em> - {{ $t('general.saveForm') }}
    Ctrl+<em>F</em> - {{ $t('general.openSearchWindow') }}
    Ctrl+<em>M</em> - {{ $t('general.openMenu') }}
    Ctrl+<em>H</em> - {{ $t('general.openTabsHistory') }}
  </pre>
</template>
