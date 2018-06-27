
module.exports = {
  isMobile(){
    console.log(this)
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(this.get('user-agent'));
  },
  isIOS(){
    return /iphone|ipad|ipod/i.test(this.get('user-agent'));
  },
  isWechat(){
    return /micromessenger/i.test(this.get('user-agent'));
  }
}