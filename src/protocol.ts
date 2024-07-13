/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { TypedEventTarget } from "@worker-tools/typed-event-target";

export type ReceiverEndpoint = Pick<TypedEventTarget<MessagePortEventMap>, "addEventListener"|"removeEventListener">;

export const messageChannel = Symbol('Comlink.channelSpecies');
export const adaptNative = Symbol('Comlink.adaptNative');
export const toNative = Symbol('Comlink.toNative');

export interface PostMessageWithOrigin {
  postMessage(
    message: any,
    targetOrigin: string,
    transfer?: Transferable[]
  ): void;
}

export interface Endpoint extends ReceiverEndpoint {
  postMessage(message: any, transfer?: Transferable[]): void;
  start?: () => void;
  [messageChannel]?: typeof MessageChannel;
  [adaptNative]?: (port: MessagePort) => MessagePort;
  [toNative]?: () => MessagePort;
}

export const enum WireValueType {
  RAW = "RAW",
  PROXY = "PROXY",
  THROW = "THROW",
  HANDLER = "HANDLER",
}

export interface RawWireValue {
  id?: string|number;
  type: WireValueType.RAW;
  value: {};
}

export interface HandlerWireValue {
  id?: string|number;
  type: WireValueType.HANDLER;
  name: string;
  value: unknown;
}

export type WireValue = RawWireValue | HandlerWireValue;

export type MessageId = string|number;

export const enum MessageType {
  GET = "GET",
  SET = "SET",
  APPLY = "APPLY",
  CONSTRUCT = "CONSTRUCT",
  ENDPOINT = "ENDPOINT",
  RELEASE = "RELEASE",
}

export interface GetMessage {
  id?: MessageId;
  type: MessageType.GET;
  path: string[];
}

export interface SetMessage {
  id?: MessageId;
  type: MessageType.SET;
  path: string[];
  value: WireValue;
}

export interface ApplyMessage {
  id?: MessageId;
  type: MessageType.APPLY;
  path: string[];
  argumentList: WireValue[];
}

export interface ConstructMessage {
  id?: MessageId;
  type: MessageType.CONSTRUCT;
  path: string[];
  argumentList: WireValue[];
}

export interface EndpointMessage {
  id?: MessageId;
  type: MessageType.ENDPOINT;
  value: MessagePort;
}

export interface ReleaseMessage {
  id?: MessageId;
  type: MessageType.RELEASE;
}

export type Message =
  | GetMessage
  | SetMessage
  | ApplyMessage
  | ConstructMessage
  | EndpointMessage
  | ReleaseMessage;
