import { SOUND_EFFECTS } from '../../constants';

export const playSound = (type: keyof typeof SOUND_EFFECTS) => {
  try {
    const audio = new Audio(SOUND_EFFECTS[type]);
    audio.volume = 0.4;
    audio.play().catch(e => console.log("Audio play failed (user interaction needed first)", e));
  } catch (e) {
    console.error("Error playing sound", e);
  }
};
