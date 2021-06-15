/*!
 * Copyright (c) 2019 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0
 *
 * SPDX-License-Identifier: EPL-2.0
 */

/* import {
  HttpBuilderInitialStep,
  HttpClientBuilder,
  WebSocketBuilderInitialStep,
  WebSocketClientBuilder
} from '@eclipse-ditto/ditto-javascript-client-api_1.0-pre'; */
import { HttpBuilderInitialStep, HttpClientBuilder } from '@eclipse-ditto/ditto-javascript-client-api_1.0-pre/dist/client/http-client-builder';
import { WebSocketClientBuilder } from '@eclipse-ditto/ditto-javascript-client-api_1.0-pre/dist/client/websocket-client-builder';
import { WebSocketBuilderInitialStep } from '@eclipse-ditto/ditto-javascript-client-api_1.0-pre/dist/client/websocket-client-builder';
import { FetchRequester } from './fetch-http';
import { FetchWebSocketBuilder } from './fetch-websocket';

/**
 * Starting point to build clients that can be used to get handles for browsers.
 */
export class DittoDomClient {

  /**
   * Returns a mutable builder with a fluent API for creating a Http-Ditto-Client.
   * The returned builder utilizes *Object scoping* to guide you through the building process.
   *
   * @return the builder.
   */
  public static newHttpClient(): HttpBuilderInitialStep {
    return HttpClientBuilder.newBuilder(new FetchRequester());
  }

  /**
   * Returns a mutable builder with a fluent API for creating a Web-Socket-Ditto-Client.
   * The returned builder utilizes *Object scoping* to guide you through the building process.
   *
   * @return the builder.
   */
  public static newWebSocketClient(): WebSocketBuilderInitialStep {
    return WebSocketClientBuilder.newBuilder(new FetchWebSocketBuilder());
  }
}
