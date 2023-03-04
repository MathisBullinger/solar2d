export default (element: VPElement, initialVmin: number) => {
  let vMin = initialVmin;

  const getDimensions = (): [width: number, height: number] => [
    vMin * Math.max(element.width / element.height, 1),
    vMin * Math.max(element.height / element.width, 1),
  ];

  let [width, height] = getDimensions();

  const aspectRatio = () => {
    const ratio = element.width / element.height;
    return ratio < 1 ? 1 / ratio : ratio;
  };

  const setVMin = (n: number) => {
    vMin = n;
    [width, height] = getDimensions();
  };

  const vp = {
    x: 0,
    y: 0,
    get vMin() {
      return vMin;
    },
    get vMax() {
      return aspectRatio() * vMin;
    },
    get width() {
      return width;
    },
    get height() {
      return height;
    },
    set vMin(n: number) {
      setVMin(n);
    },
    set vMax(n: number) {
      setVMin(n / aspectRatio());
    },
    set width(n: number) {
      setVMin(n * Math.min(1, element.height / element.width));
    },
    set height(n: number) {
      setVMin(n * Math.min(1, element.width / element.height));
    },
    resize() {
      setVMin(vMin);
    },
  };

  return vp;
};

type VPElement = {
  width: number;
  height: number;
};
