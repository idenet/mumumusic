export class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.iamge = image
    this.filename = `C400${this.mid}.m4a`
    this.url = url
  }
}
