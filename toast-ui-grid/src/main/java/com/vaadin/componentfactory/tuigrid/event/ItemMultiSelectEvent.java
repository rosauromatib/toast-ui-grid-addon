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
package com.vaadin.componentfactory.tuigrid.event;

import com.vaadin.componentfactory.tuigrid.TuiGrid;
import com.vaadin.flow.component.ComponentEvent;

/**
 * Event thrown when an item is resized.
 */
public class ItemMultiSelectEvent extends ComponentEvent<TuiGrid> {

    private final int[] rows;
    private boolean cancelled = false;

    public ItemMultiSelectEvent(
            TuiGrid source,
            int[] rows,
            boolean fromClient) {
        super(source, fromClient);
        this.rows = rows;
    }

    public int[] getRows() {
        return rows;
    }

    public boolean isCancelled() {
        return cancelled;
    }

    public void setCancelled(boolean cancelled) {
        this.cancelled = cancelled;
    }

    public TuiGrid getTuiGrid() {
        return (TuiGrid) source;
    }
}