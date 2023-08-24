package com.vaadin.componentfactory.tuigrid.model;

/*-
 * #%L
 * TuiGrid
 * %%
 * Copyright (C) 2021 Vaadin Ltd
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */

import elemental.json.Json;
import elemental.json.JsonObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class GuiItem implements Item {
    private List<String> recordData;
    private List<String> headers = new ArrayList<>();
    private boolean expanded;
    private List<GuiItem> _children;

    public GuiItem(List<String> recordData, List<String> headers) {
        this.recordData = recordData;
        this.headers.clear();
        this.headers.addAll(headers);
    }

    public String toJSON() {
        JsonObject js = Json.createObject();

        for (int i = 0; i < this.headers.size(); i++) {
            js.put(this.headers.get(i), this.recordData.get(i) != null ? this.recordData.get(i) : "");
        }
        if(isExpanded()){
            JsonObject attributesJs = Json.createObject();
            Optional.ofNullable(isExpanded()).ifPresent(v -> attributesJs.put("expanded", v));
            js.put("_attributes", attributesJs);
            Optional.ofNullable(convertChildrenToJson()).ifPresent(v -> js.put("_children", "[" + v + "]"));
        }
        return js.toJson();
    }

    private String convertChildrenToJson() {
        return this._children != null
                ? this._children.stream().map(child -> child.toJSON()).collect(Collectors.joining(","))
                : "";
    }

    public List<String> getRecordData() {
        return recordData;
    }

    public void setRecordData(List<String> recordData) {
        this.recordData = recordData;
    }

    public List<String> getHeaders() {
        return headers;
    }

    public void addHeader(String headerName) {
        this.headers.add(headerName);
    }

    public void setHeaders(List<String> headers) {
        this.headers = headers;
    }

    public boolean isExpanded() {
        return expanded;
    }

    public void setExpanded(boolean expanded) {
        this.expanded = expanded;
    }

    public List<GuiItem> get_children() {
        return _children;
    }

    public void set_children(List<GuiItem> _children) {
        this._children = _children;
    }
}