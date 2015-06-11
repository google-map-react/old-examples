export default function createExampleActions() {
  return {
    initExampleInfo({title, info, source, next, prev}) {
      return {title, info, source, next, prev};
    }
  };
}
