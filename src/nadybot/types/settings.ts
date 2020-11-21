import { JsonDecoder } from "ts.data.json";

export interface ConfigModule {
  // Name of the module
  readonly name: string;
  // How many commands are enabled
  num_commands_enabled: number;
  // How many commands are disabled
  num_commands_disabled: number;
  // How many events are enabled
  num_events_enabled: number;
  // How many events are disabled
  num_events_disabled: number;
  // How many settings are there?
  readonly num_settings: number;
}

export interface SettingOption {
  // Name of this option for displaying
  readonly name: string;
  // Which value does this option represent?
  value: string | number | boolean | null;
}

export enum SettingType {
  bool = "bool",
  number = "number",
  options = "options",
  int_options = "int_options",
  text = "text",
  color = "color",
  discord_channel = "discord_channel",
  time = "time",
}

export interface ModuleSetting {
  // The type of this setting (bool, number, options, etc)
  readonly type: SettingType;
  // The name of the setting
  readonly name: string;
  // The current value
  value: string | number | boolean | null;
  // A list of predefined options to pick from
  readonly options: Array<SettingOption>;
  // Is this a fixed setting (like database version) or can it be changed?
  readonly editable: boolean;
  // A description of what this setting is for
  readonly description: string;
}

export interface ModuleEventConfig {
  // The event for this module
  readonly event: string;
  // The function handling this event
  readonly handler: string;
  // What is supposed to happed when this event occurs?
  readonly description: string;
  // Is the event handler turned on?
  enabled: boolean;
}

export enum CommandType {
  Command = "cmd",
  Subcommand = "subcmd",
}

export interface ModuleSubcommandChannel {
  // The access level you need to have in order to be allowed to use this command in this channel
  access_level: string;
  // Can this command be used in this channel?
  enabled: boolean;
}

export interface ModuleSubcommand {
  // The string or regexp that has to match this command
  readonly command: string;
  // A short description of the command
  readonly description: string;
  // Either "cmd" or "subcmd"
  readonly type: CommandType;
  // Settings for tells
  msg: ModuleSubcommandChannel | null;
  // Settings for private channel
  priv: ModuleSubcommandChannel | null;
  // Settings for org channel
  org: ModuleSubcommandChannel | null;
}

export interface ModuleCommand extends ModuleSubcommand {
  // A list of subcommands for this command. Subcommands can have different rights, but cannot be enabled without the command itself being enabled. *
  readonly subcommands: Array<ModuleSubcommand>;
}

export interface ModuleAccessLevel {
  // Name of this option for displaying
  readonly name: string;
  // Which value does this option represent?
  value: string | number | boolean | null;
  // Higher value means fewer rights. Use this to sort on
  readonly numeric_value: number;
  // Some ranks only work if a module is enabled
  readonly enabled: boolean;
}

const configModuleDecoderMapping = {
  name: JsonDecoder.string,
  num_commands_enabled: JsonDecoder.number,
  num_commands_disabled: JsonDecoder.number,
  num_events_enabled: JsonDecoder.number,
  num_events_disabled: JsonDecoder.number,
  num_settings: JsonDecoder.number,
};

const configModuleDecoder = JsonDecoder.objectStrict<ConfigModule>(
  configModuleDecoderMapping,
  "ConfigModule"
);

export const configModuleArrayDecoder = JsonDecoder.array(
  configModuleDecoder,
  "ConfigModuleArray"
);

const mixedDecoder = JsonDecoder.nullable(
  JsonDecoder.oneOf<string | number | boolean>(
    [JsonDecoder.string, JsonDecoder.number, JsonDecoder.boolean],
    "mixed"
  )
);

const settingOptionDecoderMapping = {
  name: JsonDecoder.string,
  value: mixedDecoder,
};

const settingOptionDecoder = JsonDecoder.objectStrict<SettingOption>(
  settingOptionDecoderMapping,
  "SettingOption"
);

const settingTypeDecoder = JsonDecoder.enumeration<SettingType>(
  SettingType,
  "SettingType"
);
const commandTypeDecoder = JsonDecoder.enumeration<CommandType>(
  CommandType,
  "CommandType"
);

const moduleSettingDecoderMapping = {
  type: settingTypeDecoder,
  name: JsonDecoder.string,
  value: mixedDecoder,
  options: JsonDecoder.array(settingOptionDecoder, "options"),
  editable: JsonDecoder.boolean,
  description: JsonDecoder.string,
};

const moduleSettingDecoder = JsonDecoder.objectStrict<ModuleSetting>(
  moduleSettingDecoderMapping,
  "ModuleSetting"
);

export const moduleSettingArrayDecoder = JsonDecoder.array(
  moduleSettingDecoder,
  "ModuleSettingArray"
);

const moduleEventConfigDecoderMapping = {
  event: JsonDecoder.string,
  handler: JsonDecoder.string,
  description: JsonDecoder.string,
  enabled: JsonDecoder.boolean,
};

const moduleEventConfigDecoder = JsonDecoder.objectStrict<ModuleEventConfig>(
  moduleEventConfigDecoderMapping,
  "ModuleEventConfig"
);

export const moduleEventConfigArrayDecoder = JsonDecoder.array(
  moduleEventConfigDecoder,
  "ModuleEventConfigArray"
);

const moduleSubcommandChannelDecoderMapping = {
  access_level: JsonDecoder.string,
  enabled: JsonDecoder.boolean,
};

const moduleSubcommandChannelDecoder = JsonDecoder.objectStrict<ModuleSubcommandChannel>(
  moduleSubcommandChannelDecoderMapping,
  "ModuleSubcommandChannel"
);

const moduleSubcommandDecoderMapping = {
  command: JsonDecoder.string,
  description: JsonDecoder.string,
  type: commandTypeDecoder,
  msg: JsonDecoder.nullable(moduleSubcommandChannelDecoder),
  priv: JsonDecoder.nullable(moduleSubcommandChannelDecoder),
  org: JsonDecoder.nullable(moduleSubcommandChannelDecoder),
};

const moduleSubcommandDecoder = JsonDecoder.objectStrict<ModuleSubcommand>(
  moduleSubcommandDecoderMapping,
  "ModuleSubcommand"
);

const moduleCommandDecoderMapping = {
  ...moduleSubcommandDecoderMapping,
  subcommands: JsonDecoder.array(moduleSubcommandDecoder, "subcommands"),
};

const moduleCommandDecoder = JsonDecoder.objectStrict<ModuleCommand>(
  moduleCommandDecoderMapping,
  "ModuleCommand"
);

export const moduleCommandArrayDecoder = JsonDecoder.array(
  moduleCommandDecoder,
  "ModuleCommandArray"
);

const moduleAccessLevelDecoderMapping = {
  name: JsonDecoder.string,
  value: mixedDecoder,
  numeric_value: JsonDecoder.number,
  enabled: JsonDecoder.boolean,
};

const moduleAccessLevelDecoder = JsonDecoder.objectStrict<ModuleAccessLevel>(
  moduleAccessLevelDecoderMapping,
  "ModuleAccessLevel"
);

export const moduleAccessLevelArrayDecoder = JsonDecoder.array(
  moduleAccessLevelDecoder,
  "ModuleAccessLevelArray"
);
