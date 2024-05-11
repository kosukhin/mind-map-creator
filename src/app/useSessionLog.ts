import { ref } from 'vue';

const sessionMessages = ref<string[]>([]);
const sessionLog = (...sessionMessage: string[]) => {
  sessionMessage.unshift(new Date().toLocaleString());
  sessionMessages.value.unshift(sessionMessage.join(' '));
};

// System journal for debugging
export const useSessionLog = () => ({
  sessionMessages,
  sessionLog,
});
