import { createStore } from "vuex";

import { executeCommand, getOnlineMembers } from "@/nadybot/http";

import socket from "./plugins/socket";
import { OnlinePlayers, OnlinePlayer } from "@/nadybot/types/player";

const emptyPlayers: OnlinePlayers = {
  org: [],
  private_channel: [],
};

export default createStore({
  state: {
    users: emptyPlayers,
    users_failed: false,
    uuid: "",
  },
  getters: {
    allUsers(state): Array<OnlinePlayer> {
      return state.users.org.concat(state.users.private_channel);
    },
    usersFailed(state): boolean {
      return state.users_failed;
    },
  },
  mutations: {
    async loadOnlineUsers(state): Promise<void> {
      try {
        const users = await getOnlineMembers();
        state.users = users;
        state.users_failed = false;
        console.log(
          `Successfully loaded online members: ${
            users.org.length + users.private_channel.length
          }`
        );
      } catch {
        state.users_failed = true;
      }
    },
    addOnlineOrgUser(state, player: OnlinePlayer): void {
      const old_item = state.users.org.find((p) => p.name == player.name);
      if (!old_item) {
        state.users.org.push(player);
      }
    },
    addOnlinePrivUser(state, player: OnlinePlayer): void {
      const old_item = state.users.private_channel.find(
        (p) => p.name == player.name
      );
      if (!old_item) {
        state.users.private_channel.push(player);
      }
    },
    delOnlineOrgUser(state, player_name: string): void {
      state.users.org = state.users.org.filter(
        (player) => player.name != player_name
      );
    },
    delOnlinePrivUser(state, player_name: string): void {
      state.users.private_channel = state.users.private_channel.filter(
        (player) => player.name != player_name
      );
    },
  },
  actions: {
    websocketOpen(context): void {
      context.commit("loadOnlineUsers");
    },
    websocketClose(_, closeCode: number): void {
      console.log(`Websocket closed with code ${closeCode}`);
    },
    websocketUuidUpdate(context, uuid: string): void {
      context.state.uuid = uuid;
      console.log("Successfully set UUID for outgoing commands");
    },
    OnlineEvent(context, data: Record<string, unknown>): void {
      const player = data.player as OnlinePlayer;
      const channel = data.channel as string;
      if (channel == "org") {
        context.commit("addOnlineOrgUser", player);
      } else {
        context.commit("addOnlinePrivUser", player);
      }
    },
    OfflineEvent(context, data: Record<string, unknown>): void {
      const player_name = data.player as string;
      const channel = data.channel as string;
      if (channel == "org") {
        context.commit("delOnlineOrgUser", player_name);
      } else {
        context.commit("delOnlinePrivUser", player_name);
      }
    },
    async executeCommand(context, command: string): Promise<void> {
      await executeCommand(context.state.uuid, command);
    },
  },
  modules: {},
  plugins: [socket()],
});
