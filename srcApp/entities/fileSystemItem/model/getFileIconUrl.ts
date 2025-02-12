export function getFileIconUrl(fileExtension: string): string {
  const defaultIcon = "unknown.png";

  const iconMap: { [key: string]: string } = {
    pdf: "pdf.png",
    csv: "csv.png",
    doc: "doc.png",
    docx: "doc.png",
    exe: "exe.png",
    gif: "gif.png",
    xls: "xls.png",
    xlsx: "xls.png",
    jpg: "jpg.png",
    js: "js.png",
    mp3: "mp3.png",
    png: "png.png",
    svg: "svg.png",
    txt: "txt.png",
    mpg: "mpg.png",
    avi: "video.png",
    mp4: "video.png",
    mkv: "video.png",
    mpeg: "video.png",
    wmv: "video.png",
    flv: "video.png",
    html: "html.png",
    rar: "rar.png",
  };

  const iconFileName = iconMap[fileExtension.toLowerCase()] || defaultIcon;

  return iconFileName;
}
