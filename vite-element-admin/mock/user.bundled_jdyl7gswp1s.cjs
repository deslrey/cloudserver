var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// mock/user.js
var user_exports = {};
__export(user_exports, {
  default: () => user_default
});
module.exports = __toCommonJS(user_exports);
var userInfo = () => {
  const result = {
    id: 9527,
    avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    name: "deslre",
    phone: "12345678910",
    email: "2135232170@qq.com",
    identity: "",
    roles: ["admin"]
  };
  return result;
};
var list = () => {
  const result = [];
  const total = 1e4 * 10;
  for (let i = 1; i <= total; i++) {
    const item = {
      id: "@increment",
      method: i % 4,
      deviceType: '@pick(["web", "glass", "mobile", "desktop", "others"])',
      // 设备名称
      deviceOs: '@pick(["win10", "win11", "ios", "android", "others"])',
      // 系统
      loginAddr: "@city(true)",
      // 登录地点
      loginTime: " @datetime()"
      // 最后登录时间
    };
    result.push(item);
  }
  return result;
};
var user_default = [
  {
    url: "/api/login",
    type: "get",
    response: (config) => {
      return {
        code: 200,
        message: "success",
        data: {
          token: "token"
        }
        // data: loginInfo()
      };
    }
  },
  {
    url: "/api/getUserInfo",
    type: "get",
    response: () => {
      return {
        code: 200,
        message: "success",
        data: userInfo()
      };
    }
  },
  {
    url: "/api/test",
    type: "get",
    response: () => {
      return {
        code: 5004,
        message: "fail",
        data: []
      };
    }
  },
  {
    url: "/api/logout",
    method: "get",
    response: () => {
      return {
        code: 200,
        message: "success"
      };
    }
  },
  {
    url: "/api/login/history",
    type: "get",
    response: (config) => {
      return {
        code: 200,
        message: "success",
        data: list()
      };
    }
  }
];
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibW9jay91c2VyLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX2luamVjdGVkX2ZpbGVuYW1lX18gPSBcIkU6XFxcXGNsb3VkXFxcXGNsb3VkU2VydmVyXFxcXHZpdGUtZWxlbWVudC1hZG1pblxcXFxtb2NrXFxcXHVzZXIuanNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiRTpcXFxcY2xvdWRcXFxcY2xvdWRTZXJ2ZXJcXFxcdml0ZS1lbGVtZW50LWFkbWluXFxcXG1vY2tcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL0U6L2Nsb3VkL2Nsb3VkU2VydmVyL3ZpdGUtZWxlbWVudC1hZG1pbi9tb2NrL3VzZXIuanNcIjtcclxuLy8gaHR0cDovL21vY2tqcy5jb20vZXhhbXBsZXMuaHRtbCNPYmplY3RcclxuY29uc3QgbG9naW5JbmZvID0gKCkgPT4ge1xyXG4gIGNvbnN0IHJlc3VsdCA9IHtcclxuICAgIHRva2VuOiAndG9rZW4nXHJcbiAgfVxyXG4gIHJldHVybiByZXN1bHRcclxufVxyXG5cclxuY29uc3QgdXNlckluZm8gPSAoKSA9PiB7XHJcbiAgY29uc3QgcmVzdWx0ID0ge1xyXG4gICAgaWQ6IDk1MjcsXHJcbiAgICBhdmF0YXI6ICdodHRwczovL3dwaW1nLndhbGxzdGNuLmNvbS9mNzc4NzM4Yy1lNGY4LTQ4NzAtYjYzNC01NjcwM2I0YWNhZmUuZ2lmJyxcclxuICAgIG5hbWU6ICdkZXNscmUnLFxyXG4gICAgcGhvbmU6ICcxMjM0NTY3ODkxMCcsXHJcbiAgICBlbWFpbDogJzIxMzUyMzIxNzBAcXEuY29tJyxcclxuICAgIGlkZW50aXR5OiAnJyxcclxuICAgIHJvbGVzOiBbJ2FkbWluJ10sXHJcbiAgfVxyXG4gIHJldHVybiByZXN1bHRcclxufVxyXG5cclxuY29uc3QgbGlzdCA9ICgpID0+IHtcclxuICBjb25zdCByZXN1bHQgPSBbXVxyXG4gIC8vIGNvbnN0IHRvdGFsID0gMTAwMDAgKiAxMFxyXG4gIGNvbnN0IHRvdGFsID0gMTAwMDAgKiAxMFxyXG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IHRvdGFsOyBpKyspIHtcclxuICAgIGNvbnN0IGl0ZW0gPSB7XHJcbiAgICAgIGlkOiAnQGluY3JlbWVudCcsXHJcbiAgICAgIG1ldGhvZCA6IGkgJSA0LFxyXG4gICAgICBkZXZpY2VUeXBlIDogJ0BwaWNrKFtcIndlYlwiLCBcImdsYXNzXCIsIFwibW9iaWxlXCIsIFwiZGVza3RvcFwiLCBcIm90aGVyc1wiXSknLCAvLyBcdThCQkVcdTU5MDdcdTU0MERcdTc5RjBcclxuICAgICAgZGV2aWNlT3MgOiAnQHBpY2soW1wid2luMTBcIiwgXCJ3aW4xMVwiLCBcImlvc1wiLCBcImFuZHJvaWRcIiwgXCJvdGhlcnNcIl0pJywgLy8gXHU3Q0ZCXHU3RURGXHJcbiAgICAgIGxvZ2luQWRkciA6ICdAY2l0eSh0cnVlKScsIC8vIFx1NzY3Qlx1NUY1NVx1NTczMFx1NzBCOVxyXG4gICAgICBsb2dpblRpbWUgOicgQGRhdGV0aW1lKCknLCAvLyBcdTY3MDBcdTU0MEVcdTc2N0JcdTVGNTVcdTY1RjZcdTk1RjRcclxuICAgIH1cclxuICAgIHJlc3VsdC5wdXNoKCBpdGVtICk7XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiByZXN1bHRcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgW1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvbG9naW4nLFxyXG4gICAgdHlwZTogJ2dldCcsXHJcbiAgICByZXNwb25zZTogY29uZmlnID0+IHtcclxuICAgICAgLy8gY29uc3QgeyB1c2VybmFtZSB9ID0gY29uZmlnLmJvZHlcclxuICAgICAgLy8gY29uc3QgdG9rZW4gPSB0b2tlbnNbdXNlcm5hbWVdXHJcbiAgICAgIC8vIGlmICghdG9rZW4pIHtcclxuICAgICAgLy8gICByZXR1cm4ge1xyXG4gICAgICAvLyAgICAgY29kZTogNjAyMDQsXHJcbiAgICAgIC8vICAgICBtZXNzYWdlOiAnXHU4RDI2XHU1M0Y3XHU1QkM2XHU3ODAxXHU5NTE5XHU4QkVGJ1xyXG4gICAgICAvLyAgIH1cclxuICAgICAgLy8gfVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgdG9rZW46ICd0b2tlbidcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZGF0YTogbG9naW5JbmZvKClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9nZXRVc2VySW5mbycsXHJcbiAgICB0eXBlOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiAoKSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMjAwLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdzdWNjZXNzJyxcclxuICAgICAgICBkYXRhOiB1c2VySW5mbygpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIFxyXG4gIHtcclxuICAgIHVybDogJy9hcGkvdGVzdCcsXHJcbiAgICB0eXBlOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiAoKSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogNTAwNCxcclxuICAgICAgICBtZXNzYWdlOiAnZmFpbCcsXHJcbiAgICAgICAgZGF0YTogW11cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXHJcbiAge1xyXG4gICAgdXJsOiBcIi9hcGkvbG9nb3V0XCIsXHJcbiAgICBtZXRob2Q6IFwiZ2V0XCIsXHJcbiAgICByZXNwb25zZTogKCkgPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICBtZXNzYWdlOiAnc3VjY2VzcydcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIFxyXG4gIHtcclxuICAgIHVybDogJy9hcGkvbG9naW4vaGlzdG9yeScsXHJcbiAgICB0eXBlOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiBjb25maWcgPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgICAgICAgZGF0YTogbGlzdCgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5dXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBU0EsSUFBTSxXQUFXLE1BQU07QUFDckIsUUFBTSxTQUFTO0FBQUEsSUFDYixJQUFJO0FBQUEsSUFDSixRQUFRO0FBQUEsSUFDUixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxPQUFPO0FBQUEsSUFDUCxVQUFVO0FBQUEsSUFDVixPQUFPLENBQUMsT0FBTztBQUFBLEVBQ2pCO0FBQ0EsU0FBTztBQUNUO0FBRUEsSUFBTSxPQUFPLE1BQU07QUFDakIsUUFBTSxTQUFTLENBQUM7QUFFaEIsUUFBTSxRQUFRLE1BQVE7QUFDdEIsV0FBUyxJQUFJLEdBQUcsS0FBSyxPQUFPLEtBQUs7QUFDL0IsVUFBTSxPQUFPO0FBQUEsTUFDWCxJQUFJO0FBQUEsTUFDSixRQUFTLElBQUk7QUFBQSxNQUNiLFlBQWE7QUFBQTtBQUFBLE1BQ2IsVUFBVztBQUFBO0FBQUEsTUFDWCxXQUFZO0FBQUE7QUFBQSxNQUNaLFdBQVc7QUFBQTtBQUFBLElBQ2I7QUFDQSxXQUFPLEtBQU0sSUFBSztBQUFBLEVBQ3BCO0FBRUEsU0FBTztBQUNUO0FBRUEsSUFBTyxlQUFRO0FBQUEsRUFDYjtBQUFBLElBQ0UsS0FBSztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sVUFBVSxZQUFVO0FBU2xCLGFBQU87QUFBQSxRQUNMLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxRQUNULE1BQU07QUFBQSxVQUNKLE9BQU87QUFBQSxRQUNUO0FBQUE7QUFBQSxNQUVGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUVBO0FBQUEsSUFDRSxLQUFLO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixVQUFVLE1BQU07QUFDZCxhQUFPO0FBQUEsUUFDTCxNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsUUFDVCxNQUFNLFNBQVM7QUFBQSxNQUNqQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFFQTtBQUFBLElBQ0UsS0FBSztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sVUFBVSxNQUFNO0FBQ2QsYUFBTztBQUFBLFFBQ0wsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLFFBQ1QsTUFBTSxDQUFDO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFFQTtBQUFBLElBQ0UsS0FBSztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsVUFBVSxNQUFNO0FBQ2QsYUFBTztBQUFBLFFBQ0wsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLE1BQ1g7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBRUE7QUFBQSxJQUNFLEtBQUs7QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFVBQVUsWUFBVTtBQUNsQixhQUFPO0FBQUEsUUFDTCxNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsUUFDVCxNQUFNLEtBQUs7QUFBQSxNQUNiO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
