import { ROLES, Role } from "@/data/types/guildMember";
import { ROLE_HIERARCHY, canManageGuild, getRoleMeta, hasMinRole } from "@/utils/role";

describe("ROLE_HIERARCHY", () => {
  it("ROLES 순서대로 등급이 올라간다", () => {
    expect(ROLES.map((role) => ROLE_HIERARCHY[role])).toEqual([0, 1, 2, 3, 4]);
  });
});

describe("hasMinRole", () => {
  it.each<{ role: Role; minRole: Role; expected: boolean }>([
    { role: "guildManager", minRole: "guildManager", expected: true },
    { role: "adminSuper", minRole: "guildManager", expected: true },
    { role: "userUploader", minRole: "guildManager", expected: false },
    { role: "userNormal", minRole: "userNormal", expected: true },
  ])("$role은 $minRole 이상인가 → $expected", ({ role, minRole, expected }) => {
    expect(hasMinRole(role, minRole)).toBe(expected);
  });

  it.each([undefined, "", "unknownRole", "toString", "constructor"])(
    "역할이 %p이면 false다",
    (role) => {
      expect(hasMinRole(role, "userNormal")).toBe(false);
    }
  );
});

describe("canManageGuild", () => {
  it.each<{ role: string | undefined; expected: boolean }>([
    { role: "userNormal", expected: false },
    { role: "userUploader", expected: false },
    { role: "guildManager", expected: true },
    { role: "adminNormal", expected: true },
    { role: "adminSuper", expected: true },
    { role: undefined, expected: false },
  ])("$role → $expected", ({ role, expected }) => {
    expect(canManageGuild(role)).toBe(expected);
  });
});

describe("getRoleMeta", () => {
  it.each([
    { role: "adminSuper", label: "관리자" },
    { role: "adminNormal", label: "관리자" },
    { role: "guildManager", label: "매니저" },
    { role: "userUploader", label: "업로더" },
    { role: "userNormal", label: "일반" },
  ])("$role → $label", ({ role, label }) => {
    expect(getRoleMeta(role).label).toBe(label);
  });

  it.each(["unknownRole", "toString", "constructor"])(
    "모르는 역할 %p는 일반으로 보여준다",
    (role) => {
      expect(getRoleMeta(role)).toEqual(getRoleMeta("userNormal"));
    }
  );
});
