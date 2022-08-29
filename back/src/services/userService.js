import { User } from "../db"; // from을 폴더(db) 로 설정 시, 디폴트로 index.js 로부터 import함.
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

class userAuthService {
  static async addUser({ name, email, password }) {
    // 이메일 중복 확인
    const user = await User.findByEmail({ email });
    if (user) {
      const errorMessage =
        "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.";
      return { errorMessage };
    }

    // 비밀번호 해쉬화
    const hashedPassword = await bcrypt.hash(password, 10);

    // id 는 유니크 값 부여
    const user_id = uuidv4();
    const newUser = { user_id, name, email, password: hashedPassword };

    // db에 저장
    const createdNewUser = await User.create({ newUser });
    createdNewUser.errorMessage = null; // 문제 없이 db 저장 완료되었으므로 에러가 없음.

    return createdNewUser;
  }

  static async getUser({ email, password }) {
    // 이메일 db에 존재 여부 확인
    const user = await User.findByEmail({ email });
    if (!user) {
      const errorMessage =
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );
    if (!isPasswordCorrect) {
      const errorMessage =
        "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || "jwt-secret-key";
    const token = jwt.sign({ user_id: user.user_id }, secretKey);

    // 반환할 loginuser 객체를 위한 변수 설정
    const user_id = user.user_id;
    const name = user.name;
    const description = user.description;

    const loginUser = {
      token,
      user_id,
      email,
      name,
      description,
      errorMessage: null,
    };

    return loginUser;
  }

  static async getUsers() {
    const users = await User.findAll();
    return users;
  }

  static async setUser({ user_id, toUpdate }) {
    // 우선 해당 id 의 유저가 db에 존재하는지 여부 확인
    let user = await User.findById(user_id);
    const { name, email, password, description, introduction } = toUpdate;
    console.log("불러온 유저의 정보:", user);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      const errorMessage = "가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    // 업데이트 대상에 name이 있다면, 즉 name 값이 null 이 아니라면 업데이트 진행
    if (toUpdate.name !== null) {
      console.log("name is updated");
      const fieldToUpdate = "name";
      const newValue = toUpdate.name;
      user = await User.update({ user_id, fieldToUpdate, newValue });
    }

    if (toUpdate.email !== null && user.email !== toUpdate.email) {
      let email = await User.findByEmail({ email: toUpdate.email });
      if (email) {
        const errorMessage =
          "이미 가입한 이메일입니다. 다른 이메일을 사용해주세요.";
        return { errorMessage };
      }
      console.log("email is updated");
      const fieldToUpdate = "email";
      const newValue = toUpdate.email;
      user = await User.update({ user_id, fieldToUpdate, newValue });
    }
    //Didn't make edit password section yet
    if (toUpdate.password !== null) {
      const currentPassword = user.password;
      const compareInputandCurrent = await bcrypt.compare(
        toUpdate.password,
        currentPassword
      );
      console.log("password is updated");
      const hashedNewPassword = await bcrypt.hash(toUpdate.password, 10);
      const fieldToUpdate = "password";
      const newValue = hashedNewPassword;
      user = await User.update({ user_id, fieldToUpdate, newValue });
    }
    if (toUpdate.description !== null) {
      console.log("description is updated");
      const fieldToUpdate = "description";
      const newValue = toUpdate.description;
      user = await User.update({ user_id, fieldToUpdate, newValue });
    }

    console.log("nothing to update");
    console.log("리턴하는 유저는?", user);

    return user;
  }

  static async getUserInfo(user_id) {
    const user = await User.findById(user_id);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      const errorMessage =
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return user;
  }

  /* -- Verification --*/
  static async getCheckPassword(user_id, toCheckPassword) {
    let user = await User.findById(user_id);
    if (!user) {
      const errorMessage = "잘못된 접근입니다(Error_getCheckPassword).";
      return { errorMessage };
    }
    // Checking Password
    //user.password means the user's password which is exist in DB.
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      toCheckPassword,
      correctPasswordHash
    );
    if (!isPasswordCorrect) {
      const errorMessage =
        "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    return user;
  }
}

export { userAuthService };
