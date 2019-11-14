const middleware = {}

middleware['isLogin'] = require('../middleware/isLogin.js')
middleware['isLogin'] = middleware['isLogin'].default || middleware['isLogin']

middleware['isNotLogin'] = require('../middleware/isNotLogin.js')
middleware['isNotLogin'] = middleware['isNotLogin'].default || middleware['isNotLogin']

export default middleware
