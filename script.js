// Global variables
let mountCounter = 1;

// Unit conversion factors (to mm)
const UNIT_CONVERSIONS = {
    'mm': 1,
    'cm': 10,
    'in': 25.4
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Add event listeners
    document.getElementById('addMountBtn').addEventListener('click', addMount);
    document.getElementById('calculateBtn').addEventListener('click', calculateYield);
    
    // Add event listeners for unit changes
    addUnitChangeListeners();
}

function toggleHelp() {
    const helpSection = document.getElementById('helpSection');
    const helpToggleText = document.getElementById('helpToggleText');
    
    if (helpSection.style.display === 'none') {
        helpSection.style.display = 'block';
        helpToggleText.textContent = 'Hide Help & Examples';
    } else {
        helpSection.style.display = 'none';
        helpToggleText.textContent = 'Show Help & Examples';
    }
}

function addUnitChangeListeners() {
    // Sheet configuration unit changes
    ['sheetWidth', 'sheetHeight', 'outerGutter', 'apertureGutter'].forEach(id => {
        const input = document.getElementById(id);
        const unitSelect = document.getElementById(id + 'Unit');
        
        if (input && unitSelect) {
            unitSelect.addEventListener('change', function() {
                const currentValue = parseFloat(input.value) || 0;
                const currentUnit = unitSelect.getAttribute('data-previous-unit') || 'mm';
                const newUnit = unitSelect.value;
                
                if (currentValue > 0) {
                    const valueInMm = currentValue * UNIT_CONVERSIONS[currentUnit];
                    const newValue = valueInMm / UNIT_CONVERSIONS[newUnit];
                    input.value = newValue.toFixed(2);
                }
                
                unitSelect.setAttribute('data-previous-unit', newUnit);
            });
        }
    });
}

function addMount() {
    const mountsContainer = document.getElementById('mountsContainer');
    const mountCount = mountsContainer.children.length;
    
    if (mountCount >= 20) {
        alert('Maximum of 20 mounts allowed');
        return;
    }
    
    mountCounter++;
    
    const mountHtml = `
        <div class="mount-item" data-mount-id="${mountCounter}">
            <div class="mount-header">
                <h3>Mount #${mountCounter}</h3>
                <button type="button" class="remove-mount" onclick="removeMount(${mountCounter})">×</button>
            </div>
            <div class="form-group">
                <label>Outer Size:</label>
                <div class="size-inputs">
                    <div class="input-group">
                        <input type="number" class="outerWidth" step="0.1" min="0" placeholder="Width" required>
                        <select class="outerWidthUnit">
                            <option value="mm">mm</option>
                            <option value="cm">cm</option>
                            <option value="in">inches</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <input type="number" class="outerHeight" step="0.1" min="0" placeholder="Height" required>
                        <select class="outerHeightUnit">
                            <option value="mm">mm</option>
                            <option value="cm">cm</option>
                            <option value="in">inches</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>Quantity:</label>
                <input type="number" class="quantity" min="1" value="1" required>
            </div>
            <div class="apertures-section">
                <label>Aperture (optional):</label>
                <div class="size-inputs">
                    <div class="input-group">
                        <input type="number" class="apertureWidth" step="0.1" min="0" placeholder="Width">
                        <select class="apertureWidthUnit">
                            <option value="mm">mm</option>
                            <option value="cm">cm</option>
                            <option value="in">inches</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <input type="number" class="apertureHeight" step="0.1" min="0" placeholder="Height">
                        <select class="apertureHeightUnit">
                            <option value="mm">mm</option>
                            <option value="cm">cm</option>
                            <option value="in">inches</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    mountsContainer.insertAdjacentHTML('beforeend', mountHtml);
    updateMountNumbers();
}

function removeMount(mountId) {
    const mountElement = document.querySelector(`[data-mount-id="${mountId}"]`);
    if (mountElement) {
        mountElement.remove();
        updateMountNumbers();
    }
}

function updateMountNumbers() {
    const mountItems = document.querySelectorAll('.mount-item');
    mountItems.forEach((item, index) => {
        const newId = index + 1;
        item.setAttribute('data-mount-id', newId);
        item.querySelector('h3').textContent = `Mount #${newId}`;
        
        // Update remove button onclick
        const removeBtn = item.querySelector('.remove-mount');
        removeBtn.onclick = () => removeMount(newId);
    });
}



function convertToMm(value, unit) {
    return value * UNIT_CONVERSIONS[unit];
}

function getSheetData() {
    const width = parseFloat(document.getElementById('sheetWidth').value) || 0;
    const widthUnit = document.getElementById('sheetWidthUnit').value;
    const height = parseFloat(document.getElementById('sheetHeight').value) || 0;
    const heightUnit = document.getElementById('sheetHeightUnit').value;
    const outerGutter = parseFloat(document.getElementById('outerGutter').value) || 0;
    const outerGutterUnit = document.getElementById('outerGutterUnit').value;
    const apertureGutter = parseFloat(document.getElementById('apertureGutter').value) || 0;
    const apertureGutterUnit = document.getElementById('apertureGutterUnit').value;
    const price = parseFloat(document.getElementById('sheetPrice').value) || 0;
    
    return {
        width: convertToMm(width, widthUnit),
        height: convertToMm(height, heightUnit),
        outerGutter: convertToMm(outerGutter, outerGutterUnit),
        apertureGutter: convertToMm(apertureGutter, apertureGutterUnit),
        price: price
    };
}

function getMountsData() {
    const mounts = [];
    const mountItems = document.querySelectorAll('.mount-item');
    
    mountItems.forEach((mountItem, index) => {
        const mountId = index + 1;
        const outerWidth = parseFloat(mountItem.querySelector('.outerWidth').value) || 0;
        const outerWidthUnit = mountItem.querySelector('.outerWidthUnit').value;
        const outerHeight = parseFloat(mountItem.querySelector('.outerHeight').value) || 0;
        const outerHeightUnit = mountItem.querySelector('.outerHeightUnit').value;
        const quantity = parseInt(mountItem.querySelector('.quantity').value) || 0;
        
        const apertures = [];
        const apertureWidth = parseFloat(mountItem.querySelector('.apertureWidth').value) || 0;
        const apertureWidthUnit = mountItem.querySelector('.apertureWidthUnit').value;
        const apertureHeight = parseFloat(mountItem.querySelector('.apertureHeight').value) || 0;
        const apertureHeightUnit = mountItem.querySelector('.apertureHeightUnit').value;
        
        if (apertureWidth > 0 && apertureHeight > 0) {
            apertures.push({
                width: convertToMm(apertureWidth, apertureWidthUnit),
                height: convertToMm(apertureHeight, apertureHeightUnit)
            });
        }
        
        if (outerWidth > 0 && outerHeight > 0 && quantity > 0) {
            mounts.push({
                id: mountId,
                outerWidth: convertToMm(outerWidth, outerWidthUnit),
                outerHeight: convertToMm(outerHeight, outerHeightUnit),
                quantity: quantity,
                apertures: apertures
            });
        }
    });
    
    return mounts;
}

function calculateYield() {
    const sheet = getSheetData();
    const mounts = getMountsData();
    
    if (sheet.width === 0 || sheet.height === 0) {
        alert('Please enter sheet dimensions');
        return;
    }
    
    if (mounts.length === 0) {
        alert('Please add at least one mount with valid dimensions');
        return;
    }
    
    // Calculate available cutting area
    const availableWidth = sheet.width - (2 * sheet.outerGutter);
    const availableHeight = sheet.height - (2 * sheet.outerGutter);
    
    if (availableWidth <= 0 || availableHeight <= 0) {
        alert('Sheet dimensions are too small for the specified gutters');
        return;
    }
    
    // First, check for aperture nesting opportunities
    const nestingAnalysis = analyzeApertureNesting(mounts, sheet.apertureGutter);
    
    // Calculate yield for each mount including mixed orientations and nesting
    const results = mounts.map(mount => {
        const normalYield = calculateMountYield(mount, availableWidth, availableHeight, sheet.apertureGutter);
        const rotatedYield = calculateMountYield({
            ...mount,
            outerWidth: mount.outerHeight,
            outerHeight: mount.outerWidth
        }, availableWidth, availableHeight, sheet.apertureGutter);
        
        // Calculate mixed orientation yield
        const mixedYield = calculateMixedOrientationYield(mount, availableWidth, availableHeight, sheet.apertureGutter);
        
        // Determine best approach
        let bestYield = Math.max(normalYield, rotatedYield, mixedYield.totalYield);
        let approach = 'normal';
        let mixedDetails = null;
        

        
        if (mixedYield.totalYield >= normalYield && mixedYield.totalYield >= rotatedYield) {
            approach = 'mixed';
            bestYield = mixedYield.totalYield;
            mixedDetails = mixedYield;
        } else if (rotatedYield > normalYield) {
            approach = 'rotated';
        }
        

        
        // Check if this mount can be nested in another mount's aperture
        const nestingInfo = nestingAnalysis.find(n => n.nestedMount.id === mount.id);
        
        return {
            mount: mount,
            normalYield: normalYield,
            rotatedYield: rotatedYield,
            mixedYield: mixedYield,
            bestYield: bestYield,
            approach: approach,
            isRotated: approach === 'rotated',
            isMixed: approach === 'mixed',
            mixedDetails: mixedDetails,
            nestingInfo: nestingInfo
        };
    });
    
    // Calculate total sheets needed with nesting optimization
    const totalSheets = calculateTotalSheetsWithNesting(results, nestingAnalysis);
    const totalCost = totalSheets * sheet.price;
    const efficiency = calculateEfficiency(results, sheet, totalSheets);
    
    // Display results
    displayResults(results, totalSheets, totalCost, efficiency, sheet);
    displayLayout(results, sheet, nestingAnalysis);
    displayBreakdown(results);
    displayPackingAnalysis(results, sheet);
}

function calculateMountYield(mount, availableWidth, availableHeight, apertureGutter) {
    // Calculate how many mounts fit in normal orientation
    const mountsPerRow = Math.floor(availableWidth / mount.outerWidth);
    const mountsPerColumn = Math.floor(availableHeight / mount.outerHeight);
    const mountsPerSheet = mountsPerRow * mountsPerColumn;
    
    // Check if any apertures can be nested
    let nestedMounts = 0;
    if (mount.apertures.length > 0) {
        mount.apertures.forEach(aperture => {
            // Check if smaller mounts can fit in this aperture
            // This is a simplified calculation - in practice, you'd need more complex nesting logic
            const apertureArea = aperture.width * aperture.height;
            if (apertureArea > 1000) { // Minimum area for nesting consideration
                nestedMounts += Math.floor(apertureArea / (mount.outerWidth * mount.outerHeight));
            }
        });
    }
    
    return mountsPerSheet + nestedMounts;
}

function calculateMixedOrientationYield(mount, availableWidth, availableHeight, apertureGutter) {
    // Normal dimensions
    const normalWidth = mount.outerWidth;
    const normalHeight = mount.outerHeight;
    
    // Rotated dimensions
    const rotatedWidth = mount.outerHeight;
    const rotatedHeight = mount.outerWidth;
    
    // Calculate basic yields for reference
    const normalMountsPerRow = Math.floor(availableWidth / normalWidth);
    const normalMountsPerColumn = Math.floor(availableHeight / normalHeight);
    const normalYield = normalMountsPerRow * normalMountsPerColumn;
    
    const rotatedMountsPerRow = Math.floor(availableWidth / rotatedWidth);
    const rotatedMountsPerColumn = Math.floor(availableHeight / rotatedHeight);
    const rotatedYield = rotatedMountsPerRow * rotatedMountsPerColumn;
    

    
    // Try different mixed strategies - enhanced with column-based arrangements
    let bestMixedYield = 0;
    let bestMixedDetails = {
        normalCount: 0,
        rotatedCount: 0,
        totalYield: 0,
        strategy: 'none'
    };
    
    // Strategy 1: Fill with normal orientation first, then try to fit rotated in remaining space
    let strategy1 = tryMixedStrategy1(mount, availableWidth, availableHeight, normalWidth, normalHeight, rotatedWidth, rotatedHeight);
    if (strategy1.totalYield > bestMixedYield) {
        bestMixedYield = strategy1.totalYield;
        bestMixedDetails = strategy1;
    }
    
    // Strategy 2: Fill with rotated orientation first, then try to fit normal in remaining space
    let strategy2 = tryMixedStrategy2(mount, availableWidth, availableHeight, normalWidth, normalHeight, rotatedWidth, rotatedHeight);
    if (strategy2.totalYield > bestMixedYield) {
        bestMixedYield = strategy2.totalYield;
        bestMixedDetails = strategy2;
    }
    
    // Strategy 3: Try alternating rows of different orientations
    let strategy3 = tryMixedStrategy3(mount, availableWidth, availableHeight, normalWidth, normalHeight, rotatedWidth, rotatedHeight);
    if (strategy3.totalYield > bestMixedYield) {
        bestMixedYield = strategy3.totalYield;
        bestMixedDetails = strategy3;
    }
    
    // Strategy 4: Column-based mixed arrangements (NEW - for better space utilization)
    let strategy4 = tryColumnMixedStrategy(mount, availableWidth, availableHeight, normalWidth, normalHeight, rotatedWidth, rotatedHeight);
    if (strategy4.totalYield > bestMixedYield) {
        bestMixedYield = strategy4.totalYield;
        bestMixedDetails = strategy4;
    }
    
    // Strategy 5: Reverse column-based mixed arrangements (NEW)
    let strategy5 = tryReverseColumnMixedStrategy(mount, availableWidth, availableHeight, normalWidth, normalHeight, rotatedWidth, rotatedHeight);
    if (strategy5.totalYield > bestMixedYield) {
        bestMixedYield = strategy5.totalYield;
        bestMixedDetails = strategy5;
    }
    
    return bestMixedDetails;
}

function tryMixedStrategy1(mount, availableWidth, availableHeight, normalWidth, normalHeight, rotatedWidth, rotatedHeight) {
    // Fill with normal orientation first
    const normalMountsPerRow = Math.floor(availableWidth / normalWidth);
    const normalMountsPerColumn = Math.floor(availableHeight / normalHeight);
    const normalCount = normalMountsPerRow * normalMountsPerColumn;
    
    // Calculate remaining space
    const usedWidth = normalMountsPerRow * normalWidth;
    const usedHeight = normalMountsPerColumn * normalHeight;
    const remainingWidth = availableWidth - usedWidth;
    const remainingHeight = availableHeight - usedHeight;
    
    let rotatedCount = 0;
    
    // Try to fit rotated mounts in remaining width (vertical strip)
    if (remainingWidth >= rotatedWidth) {
        const rotatedInStrip = Math.floor(remainingWidth / rotatedWidth) * Math.floor(availableHeight / rotatedHeight);
        rotatedCount += rotatedInStrip;
    }
    
    // Try to fit rotated mounts in remaining height (horizontal strip)
    if (remainingHeight >= rotatedHeight) {
        const rotatedInStrip = Math.floor(usedWidth / rotatedWidth) * Math.floor(remainingHeight / rotatedHeight);
        rotatedCount += rotatedInStrip;
    }
    

    
    return {
        normalCount: normalCount,
        rotatedCount: rotatedCount,
        totalYield: normalCount + rotatedCount,
        strategy: 'normal-first'
    };
}

function tryMixedStrategy2(mount, availableWidth, availableHeight, normalWidth, normalHeight, rotatedWidth, rotatedHeight) {
    // Fill with rotated orientation first
    const rotatedMountsPerRow = Math.floor(availableWidth / rotatedWidth);
    const rotatedMountsPerColumn = Math.floor(availableHeight / rotatedHeight);
    const rotatedCount = rotatedMountsPerRow * rotatedMountsPerColumn;
    
    // Calculate remaining space
    const usedWidth = rotatedMountsPerRow * rotatedWidth;
    const usedHeight = rotatedMountsPerColumn * rotatedHeight;
    const remainingWidth = availableWidth - usedWidth;
    const remainingHeight = availableHeight - usedHeight;
    
    let normalCount = 0;
    
    // Try to fit normal mounts in remaining width (vertical strip)
    if (remainingWidth >= normalWidth) {
        const normalInStrip = Math.floor(remainingWidth / normalWidth) * Math.floor(availableHeight / normalHeight);
        normalCount += normalInStrip;
    }
    
    // Try to fit normal mounts in remaining height (horizontal strip)
    if (remainingHeight >= normalHeight) {
        const normalInStrip = Math.floor(usedWidth / normalWidth) * Math.floor(remainingHeight / normalHeight);
        normalCount += normalInStrip;
    }
    

    
    return {
        normalCount: normalCount,
        rotatedCount: rotatedCount,
        totalYield: normalCount + rotatedCount,
        strategy: 'rotated-first'
    };
}

function tryMixedStrategy3(mount, availableWidth, availableHeight, normalWidth, normalHeight, rotatedWidth, rotatedHeight) {
    // Try alternating rows of different orientations
    let normalCount = 0;
    let rotatedCount = 0;
    let currentHeight = 0;
    
    // Alternate between normal and rotated rows
    let useNormalRow = true;
    
    while (currentHeight < availableHeight) {
        if (useNormalRow && currentHeight + normalHeight <= availableHeight) {
            // Add a row of normal orientation
            const mountsInRow = Math.floor(availableWidth / normalWidth);
            normalCount += mountsInRow;
            currentHeight += normalHeight;
        } else if (!useNormalRow && currentHeight + rotatedHeight <= availableHeight) {
            // Add a row of rotated orientation
            const mountsInRow = Math.floor(availableWidth / rotatedWidth);
            rotatedCount += mountsInRow;
            currentHeight += rotatedHeight;
        } else {
            // Try the other orientation if current one doesn't fit
            if (useNormalRow && currentHeight + rotatedHeight <= availableHeight) {
                const mountsInRow = Math.floor(availableWidth / rotatedWidth);
                rotatedCount += mountsInRow;
                currentHeight += rotatedHeight;
            } else if (!useNormalRow && currentHeight + normalHeight <= availableHeight) {
                const mountsInRow = Math.floor(availableWidth / normalWidth);
                normalCount += mountsInRow;
                currentHeight += normalHeight;
            } else {
                // Neither orientation fits, stop
                break;
            }
        }
        
        useNormalRow = !useNormalRow; // Alternate
    }
    
    return {
        normalCount: normalCount,
        rotatedCount: rotatedCount,
        totalYield: normalCount + rotatedCount,
        strategy: 'alternating-rows'
    };
}

function tryColumnMixedStrategy(mount, availableWidth, availableHeight, normalWidth, normalHeight, rotatedWidth, rotatedHeight) {
    // Strategy: Fill columns with rotated orientation first, then fill remaining width with normal
    let bestCombination = {
        normalCount: 0,
        rotatedCount: 0,
        totalYield: 0,
        strategy: 'column-mixed-rotated-first'
    };
    
    const maxRotatedColumns = Math.floor(availableWidth / rotatedWidth);
    const rotatedMountsPerColumn = Math.floor(availableHeight / rotatedHeight);
    
    // Try different numbers of rotated columns (0 to max possible)
    for (let rotatedCols = 0; rotatedCols <= maxRotatedColumns; rotatedCols++) {
        const rotatedCount = rotatedCols * rotatedMountsPerColumn;
        const usedWidth = rotatedCols * rotatedWidth;
        const remainingWidth = availableWidth - usedWidth;
        
        // See how many normal orientation mounts fit in remaining width
        let normalCount = 0;
        if (remainingWidth >= normalWidth) {
            const normalColumns = Math.floor(remainingWidth / normalWidth);
            const normalMountsPerColumn = Math.floor(availableHeight / normalHeight);
            normalCount = normalColumns * normalMountsPerColumn;
        }
        
        const totalYield = rotatedCount + normalCount;
        

        
        if (totalYield > bestCombination.totalYield) {
            bestCombination = {
                normalCount: normalCount,
                rotatedCount: rotatedCount,
                totalYield: totalYield,
                strategy: 'column-mixed-rotated-first',
                rotatedColumns: rotatedCols,
                normalColumns: remainingWidth >= normalWidth ? Math.floor(remainingWidth / normalWidth) : 0
            };
        }
    }
    
    return bestCombination;
}

function tryReverseColumnMixedStrategy(mount, availableWidth, availableHeight, normalWidth, normalHeight, rotatedWidth, rotatedHeight) {
    // Strategy: Fill columns with normal orientation first, then fill remaining width with rotated
    let bestCombination = {
        normalCount: 0,
        rotatedCount: 0,
        totalYield: 0,
        strategy: 'column-mixed-normal-first'
    };
    
    const maxNormalColumns = Math.floor(availableWidth / normalWidth);
    const normalMountsPerColumn = Math.floor(availableHeight / normalHeight);
    
    // Try different numbers of normal columns (0 to max possible)
    for (let normalCols = 0; normalCols <= maxNormalColumns; normalCols++) {
        const normalCount = normalCols * normalMountsPerColumn;
        const usedWidth = normalCols * normalWidth;
        const remainingWidth = availableWidth - usedWidth;
        
        // See how many rotated orientation mounts fit in remaining width
        let rotatedCount = 0;
        if (remainingWidth >= rotatedWidth) {
            const rotatedColumns = Math.floor(remainingWidth / rotatedWidth);
            const rotatedMountsPerColumn = Math.floor(availableHeight / rotatedHeight);
            rotatedCount = rotatedColumns * rotatedMountsPerColumn;
        }
        
        const totalYield = normalCount + rotatedCount;
        if (totalYield > bestCombination.totalYield) {
            bestCombination = {
                normalCount: normalCount,
                rotatedCount: rotatedCount,
                totalYield: totalYield,
                strategy: 'column-mixed-normal-first',
                normalColumns: normalCols,
                rotatedColumns: remainingWidth >= rotatedWidth ? Math.floor(remainingWidth / rotatedWidth) : 0
            };
        }
    }
    
    return bestCombination;
}

function analyzeApertureNesting(mounts, apertureGutter) {
    const nestingOpportunities = [];
    
    // Check each mount to see if it can fit inside another mount's apertures
    for (let i = 0; i < mounts.length; i++) {
        const smallerMount = mounts[i];
        
        for (let j = 0; j < mounts.length; j++) {
            if (i === j) continue; // Skip self
            
            const largerMount = mounts[j];
            
            // Check if smaller mount can fit in any of the larger mount's apertures
            for (let k = 0; k < largerMount.apertures.length; k++) {
                const aperture = largerMount.apertures[k];
                
                // Account for aperture gutter - reduce available space by gutter on all sides
                const availableWidth = aperture.width - (2 * apertureGutter);
                const availableHeight = aperture.height - (2 * apertureGutter);
                
                // Check if smaller mount fits in normal orientation (with gutter)
                const fitsNormal = (smallerMount.outerWidth <= availableWidth && 
                                  smallerMount.outerHeight <= availableHeight);
                
                // Check if smaller mount fits in rotated orientation (with gutter)
                const fitsRotated = (smallerMount.outerHeight <= availableWidth && 
                                   smallerMount.outerWidth <= availableHeight);
                
                if (fitsNormal || fitsRotated) {
                    // Calculate how many smaller mounts can fit per aperture (accounting for gutter)
                    let mountsPerAperture = 0;
                    let bestOrientation = 'normal';
                    
                    if (fitsNormal) {
                        const across = Math.floor(availableWidth / smallerMount.outerWidth);
                        const down = Math.floor(availableHeight / smallerMount.outerHeight);
                        mountsPerAperture = across * down;
                        bestOrientation = 'normal';
                    }
                    
                    if (fitsRotated) {
                        const across = Math.floor(availableWidth / smallerMount.outerHeight);
                        const down = Math.floor(availableHeight / smallerMount.outerWidth);
                        const rotatedCount = across * down;
                        if (rotatedCount > mountsPerAperture) {
                            mountsPerAperture = rotatedCount;
                            bestOrientation = 'rotated';
                        }
                    }
                    
                    nestingOpportunities.push({
                        parentMount: largerMount,
                        nestedMount: smallerMount,
                        apertureIndex: k,
                        aperture: aperture,
                        availableWidth: availableWidth,
                        availableHeight: availableHeight,
                        mountsPerAperture: mountsPerAperture,
                        orientation: bestOrientation,
                        totalNestingCapacity: mountsPerAperture * largerMount.quantity,
                        apertureGutter: apertureGutter
                    });
                }
            }
        }
    }
    
    return nestingOpportunities;
}

function calculateTotalSheetsWithNesting(results, nestingAnalysis) {
    let totalSheets = 0;
    
    // Create a copy of results to track remaining quantities
    const remainingQuantities = {};
    results.forEach(result => {
        remainingQuantities[result.mount.id] = result.mount.quantity;
    });
    
    // Apply nesting optimizations
    nestingAnalysis.forEach(nesting => {
        const nestedQuantityAvailable = Math.min(
            remainingQuantities[nesting.nestedMount.id],
            nesting.totalNestingCapacity
        );
        
        if (nestedQuantityAvailable > 0) {
            remainingQuantities[nesting.nestedMount.id] -= nestedQuantityAvailable;
        }
    });
    
    // Calculate sheets needed for remaining quantities
    results.forEach(result => {
        const remainingQuantity = remainingQuantities[result.mount.id];
        if (remainingQuantity > 0) {
            const sheetsNeeded = Math.ceil(remainingQuantity / result.bestYield);
            totalSheets = Math.max(totalSheets, sheetsNeeded);
        }
    });
    
    return totalSheets;
}

function calculateTotalSheets(results) {
    let totalSheets = 0;
    
    results.forEach(result => {
        const sheetsNeeded = Math.ceil(result.mount.quantity / result.bestYield);
        totalSheets = Math.max(totalSheets, sheetsNeeded);
    });
    
    return totalSheets;
}

function calculateEfficiency(results, sheet, totalSheets) {
    const totalMountArea = results.reduce((sum, result) => {
        return sum + (result.mount.outerWidth * result.mount.outerHeight * result.mount.quantity);
    }, 0);
    
    const sheetArea = sheet.width * sheet.height;
    const usedArea = totalSheets * sheetArea;
    
    return ((totalMountArea / usedArea) * 100).toFixed(1);
}

function displayResults(results, totalSheets, totalCost, efficiency, sheet) {
    document.getElementById('totalSheets').textContent = totalSheets;
    document.getElementById('totalCost').textContent = `£${totalCost.toFixed(2)}`;
    document.getElementById('efficiency').textContent = `${efficiency}%`;
    
    document.getElementById('results').style.display = 'block';
}

function displayLayout(results, sheet, nestingAnalysis = []) {
    const canvas = document.getElementById('layoutCanvas');
    canvas.innerHTML = '';
    
    // Use a larger scale and ensure everything fits without scrollbars
    const maxCanvasWidth = 800;  // Increased from 600
    const maxCanvasHeight = 700; // Increased from 500
    const scale = Math.max(0.4, Math.min(maxCanvasWidth / sheet.width, maxCanvasHeight / sheet.height));
    const displayWidth = sheet.width * scale;
    const displayHeight = sheet.height * scale;
    
    // Ensure minimum size for good visibility
    const finalWidth = Math.max(displayWidth, 700);
    const finalHeight = Math.max(displayHeight, 600);
    
    canvas.style.width = finalWidth + 'px';
    canvas.style.height = finalHeight + 'px';
    
    // Draw sheet outline
    const sheetOutline = document.createElement('div');
    sheetOutline.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 2px solid #2d3748;
        background: #f7fafc;
    `;
    canvas.appendChild(sheetOutline);
    
    // Draw gutter area (more visible)
    const gutter = sheet.outerGutter * scale;
    const gutterArea = document.createElement('div');
    gutterArea.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
            45deg,
            rgba(255, 193, 7, 0.1),
            rgba(255, 193, 7, 0.1) 10px,
            rgba(255, 193, 7, 0.05) 10px,
            rgba(255, 193, 7, 0.05) 20px
        );
        border: 1px solid rgba(255, 193, 7, 0.3);
    `;
    canvas.appendChild(gutterArea);
    
    // Draw available cutting area
    const availableArea = document.createElement('div');
    availableArea.style.cssText = `
        position: absolute;
        top: ${gutter}px;
        left: ${gutter}px;
        width: calc(100% - ${2 * gutter}px);
        height: calc(100% - ${2 * gutter}px);
        border: 2px solid #667eea;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: inset 0 0 10px rgba(102, 126, 234, 0.1);
    `;
    canvas.appendChild(availableArea);
    
    // Calculate available area in mm
    const availableWidthMm = sheet.width - (2 * sheet.outerGutter);
    const availableHeightMm = sheet.height - (2 * sheet.outerGutter);
    
    // Filter out mounts that are fully nested (don't need separate layout)
    const parentMounts = results.filter(result => {
        const nestedInfo = nestingAnalysis.find(n => n.nestedMount.id === result.mount.id);
        return !nestedInfo || nestedInfo.totalNestingCapacity < result.mount.quantity;
    });
    
    // Draw complete layout for parent mounts only
    let totalMountsShown = 0;
    const colors = ['#667eea', '#48bb78', '#ed8936', '#e53e3e', '#9f7aea', '#38b2ac'];
    
    parentMounts.forEach((result, resultIndex) => {
        const mountColor = colors[resultIndex % colors.length];
        totalMountsShown += drawCompleteLayout(result, mountColor, scale, gutter, availableWidthMm, availableHeightMm, canvas, nestingAnalysis);
    });
    
    // Create nesting summary
    let nestingSummary = '';
    nestingAnalysis.forEach(nesting => {
        const nestedCount = Math.min(nesting.nestedMount.quantity, nesting.totalNestingCapacity);
        if (nestedCount > 0) {
            nestingSummary += `<div>🔸 ${nestedCount} × Mount #${nesting.nestedMount.id} nested in Mount #${nesting.parentMount.id} apertures</div>`;
        }
    });
    
    // Add summary information
    const summaryDiv = document.createElement('div');
    summaryDiv.style.cssText = `
        position: absolute;
        bottom: 10px;
        left: 10px;
        background: rgba(255, 255, 255, 0.9);
        padding: 8px;
        border-radius: 4px;
        font-size: 12px;
        color: #2d3748;
        font-weight: 500;
        max-width: 400px;
    `;
    summaryDiv.innerHTML = `
        <div><strong>Layout Overview:</strong> ${totalMountsShown} parent mounts per sheet (starting from gutter position)</div>
        <div>🟨 Diagonal pattern = ${sheet.outerGutter.toFixed(1)}mm safety gutter around sheet edges</div>
        <div>🔵 Blue border = Available cutting area (${(sheet.width - 2*sheet.outerGutter).toFixed(0)}×${(sheet.height - 2*sheet.outerGutter).toFixed(0)}mm)</div>
        <div>↻ = Rotated for better yield | ◐ = Mixed orientations for optimal packing</div>
        <div>🟢 Green apertures = Contain nested mounts | 🔸 = Nested mount indicators</div>
        ${nestingSummary}
    `;
    canvas.appendChild(summaryDiv);
}

function drawCompleteLayout(result, mountColor, scale, gutter, availableWidthMm, availableHeightMm, canvas, nestingAnalysis = []) {
    let mountsDrawn = 0;
    
    if (result.isMixed && result.mixedDetails) {
        // Draw mixed orientation layout properly
        mountsDrawn = drawMixedLayout(result, mountColor, scale, gutter, availableWidthMm, availableHeightMm, canvas, nestingAnalysis);
    } else {
        // Draw single orientation layout
        mountsDrawn = drawSingleOrientationLayout(result, mountColor, scale, gutter, availableWidthMm, availableHeightMm, canvas, nestingAnalysis);
    }
    
    return mountsDrawn;
}

function drawSingleOrientationLayout(result, mountColor, scale, gutter, availableWidthMm, availableHeightMm, canvas, nestingAnalysis = []) {
    const mount = result.mount;
    const isRotated = result.isRotated;
    
    // Get correct dimensions based on rotation
    const mountWidthMm = isRotated ? mount.outerHeight : mount.outerWidth;
    const mountHeightMm = isRotated ? mount.outerWidth : mount.outerHeight;
    const mountWidth = mountWidthMm * scale;
    const mountHeight = mountHeightMm * scale;
    
    // Calculate grid layout
    const mountsPerRow = Math.floor(availableWidthMm / mountWidthMm);
    const mountsPerColumn = Math.floor(availableHeightMm / mountHeightMm);
    const totalMountsPerSheet = mountsPerRow * mountsPerColumn;
    
    // Mounts start from gutter position (no centering)
    const offsetX = 0;
    const offsetY = 0;
    
    let mountsDrawn = 0;
    
    // Draw the complete grid, centered
    for (let row = 0; row < mountsPerColumn; row++) {
        for (let col = 0; col < mountsPerRow; col++) {
            const x = gutter + offsetX + (col * mountWidth);
            const y = gutter + offsetY + (row * mountHeight);
            
            drawMount(canvas, x, y, mountWidth, mountHeight, mountColor, mount, isRotated, scale, nestingAnalysis);
            mountsDrawn++;
        }
    }
    
    return mountsDrawn;
}

function drawMixedLayout(result, mountColor, scale, gutter, availableWidthMm, availableHeightMm, canvas, nestingAnalysis = []) {
    const mount = result.mount;
    const mixedDetails = result.mixedDetails;
    
    // Normal dimensions
    const normalWidthMm = mount.outerWidth;
    const normalHeightMm = mount.outerHeight;
    const normalWidth = normalWidthMm * scale;
    const normalHeight = normalHeightMm * scale;
    
    // Rotated dimensions
    const rotatedWidthMm = mount.outerHeight;
    const rotatedHeightMm = mount.outerWidth;
    const rotatedWidth = rotatedWidthMm * scale;
    const rotatedHeight = rotatedHeightMm * scale;
    
    let mountsDrawn = 0;
    let currentX = gutter;
    let currentY = gutter;
    
    if (mixedDetails.strategy === 'alternating-rows') {
        // Draw alternating rows starting from gutter position
        
        let normalRemaining = mixedDetails.normalCount;
        let rotatedRemaining = mixedDetails.rotatedCount;
        let useNormalRow = true;
        currentY = gutter;
        
        while (currentY < gutter + (availableHeightMm * scale) && (normalRemaining > 0 || rotatedRemaining > 0)) {
            if (useNormalRow && normalRemaining > 0) {
                // Draw a complete row of normal orientation
                const mountsInRow = Math.floor(availableWidthMm / normalWidthMm);
                const mountsToShow = Math.min(mountsInRow, normalRemaining);
                
                for (let col = 0; col < mountsToShow; col++) {
                    const x = gutter + (col * normalWidth);
                    drawMount(canvas, x, currentY, normalWidth, normalHeight, mountColor, mount, false, scale, nestingAnalysis);
                    mountsDrawn++;
                    normalRemaining--;
                }
                currentY += normalHeight;
            } else if (rotatedRemaining > 0) {
                // Draw a complete row of rotated orientation
                const mountsInRow = Math.floor(availableWidthMm / rotatedWidthMm);
                const mountsToShow = Math.min(mountsInRow, rotatedRemaining);
                
                for (let col = 0; col < mountsToShow; col++) {
                    const x = gutter + (col * rotatedWidth);
                    drawMount(canvas, x, currentY, rotatedWidth, rotatedHeight, mountColor, mount, true, scale, nestingAnalysis);
                    mountsDrawn++;
                    rotatedRemaining--;
                }
                currentY += rotatedHeight;
            }
            
            useNormalRow = !useNormalRow;
        }
    } else if (mixedDetails.strategy === 'column-mixed-rotated-first') {
        // Draw rotated columns first, then normal columns starting from gutter
        
        currentX = gutter;
        
        // Draw rotated columns
        if (mixedDetails.rotatedColumns && mixedDetails.rotatedColumns > 0) {
            for (let col = 0; col < mixedDetails.rotatedColumns; col++) {
                const mountsPerColumn = Math.floor(availableHeightMm / rotatedHeightMm);
                for (let row = 0; row < mountsPerColumn; row++) {
                    const x = currentX;
                    const y = gutter + (row * rotatedHeight);
                    drawMount(canvas, x, y, rotatedWidth, rotatedHeight, mountColor, mount, true, scale, nestingAnalysis);
                    mountsDrawn++;
                }
                currentX += rotatedWidth;
            }
        }
        
        // Draw normal columns in remaining space
        if (mixedDetails.normalColumns && mixedDetails.normalColumns > 0) {
            for (let col = 0; col < mixedDetails.normalColumns; col++) {
                const mountsPerColumn = Math.floor(availableHeightMm / normalHeightMm);
                for (let row = 0; row < mountsPerColumn; row++) {
                    const x = currentX;
                    const y = gutter + (row * normalHeight);
                    drawMount(canvas, x, y, normalWidth, normalHeight, mountColor, mount, false, scale, nestingAnalysis);
                    mountsDrawn++;
                }
                currentX += normalWidth;
            }
        }
    } else if (mixedDetails.strategy === 'column-mixed-normal-first') {
        // Draw normal columns first, then rotated columns starting from gutter
        
        currentX = gutter;
        
        // Draw normal columns
        if (mixedDetails.normalColumns && mixedDetails.normalColumns > 0) {
            for (let col = 0; col < mixedDetails.normalColumns; col++) {
                const mountsPerColumn = Math.floor(availableHeightMm / normalHeightMm);
                for (let row = 0; row < mountsPerColumn; row++) {
                    const x = currentX;
                    const y = gutter + (row * normalHeight);
                    drawMount(canvas, x, y, normalWidth, normalHeight, mountColor, mount, false, scale, nestingAnalysis);
                    mountsDrawn++;
                }
                currentX += normalWidth;
            }
        }
        
        // Draw rotated columns in remaining space
        if (mixedDetails.rotatedColumns && mixedDetails.rotatedColumns > 0) {
            for (let col = 0; col < mixedDetails.rotatedColumns; col++) {
                const mountsPerColumn = Math.floor(availableHeightMm / rotatedHeightMm);
                for (let row = 0; row < mountsPerColumn; row++) {
                    const x = currentX;
                    const y = gutter + (row * rotatedHeight);
                    drawMount(canvas, x, y, rotatedWidth, rotatedHeight, mountColor, mount, true, scale, nestingAnalysis);
                    mountsDrawn++;
                }
                currentX += rotatedWidth;
            }
        }
    } else {
        // For other strategies (normal-first, rotated-first), use improved mixed approach
        const primaryIsNormal = mixedDetails.strategy === 'normal-first';
        const primaryWidthMm = primaryIsNormal ? normalWidthMm : rotatedWidthMm;
        const primaryHeightMm = primaryIsNormal ? normalHeightMm : rotatedHeightMm;
        const primaryWidth = primaryIsNormal ? normalWidth : rotatedWidth;
        const primaryHeight = primaryIsNormal ? normalHeight : rotatedHeight;
        const primaryCount = primaryIsNormal ? mixedDetails.normalCount : mixedDetails.rotatedCount;
        
        // Calculate grid for primary orientation starting from gutter
        const primaryPerRow = Math.floor(availableWidthMm / primaryWidthMm);
        const primaryPerColumn = Math.floor(availableHeightMm / primaryHeightMm);
        const actualPrimaryCount = Math.min(primaryCount, primaryPerRow * primaryPerColumn);
        const primaryRows = Math.ceil(actualPrimaryCount / primaryPerRow);
        
        // Calculate used space for primary grid
        const usedWidthMm = primaryPerRow * primaryWidthMm;
        const usedHeightMm = primaryRows * primaryHeightMm;
        
        // Draw primary orientation mounts starting from gutter
        for (let i = 0; i < actualPrimaryCount; i++) {
            const row = Math.floor(i / primaryPerRow);
            const col = i % primaryPerRow;
            const x = gutter + (col * primaryWidth);
            const y = gutter + (row * primaryHeight);
            drawMount(canvas, x, y, primaryWidth, primaryHeight, mountColor, mount, !primaryIsNormal, scale, nestingAnalysis);
            mountsDrawn++;
        }
        
        // Calculate remaining space after primary grid
        const remainingWidthMm = availableWidthMm - usedWidthMm;
        const remainingHeightMm = availableHeightMm - usedHeightMm;
        
        // Draw secondary orientation in remaining spaces
        const secondaryCount = primaryIsNormal ? mixedDetails.rotatedCount : mixedDetails.normalCount;
        const secondaryWidthMm = primaryIsNormal ? rotatedWidthMm : normalWidthMm;
        const secondaryHeightMm = primaryIsNormal ? rotatedHeightMm : normalHeightMm;
        const secondaryWidth = secondaryWidthMm * scale;
        const secondaryHeight = secondaryHeightMm * scale;
        
        let remainingSecondary = secondaryCount;
        
        // Fill remaining width (vertical strip) starting from gutter
        if (remainingWidthMm >= secondaryWidthMm && remainingSecondary > 0) {
            const secondaryPerColumn = Math.floor(availableHeightMm / secondaryHeightMm);
            const secondaryColumns = Math.floor(remainingWidthMm / secondaryWidthMm);
            
            for (let col = 0; col < secondaryColumns && remainingSecondary > 0; col++) {
                for (let row = 0; row < secondaryPerColumn && remainingSecondary > 0; row++) {
                    const x = gutter + usedWidthMm * scale + (col * secondaryWidth);
                    const y = gutter + (row * secondaryHeight);
                    drawMount(canvas, x, y, secondaryWidth, secondaryHeight, mountColor, mount, primaryIsNormal, scale, nestingAnalysis);
                    mountsDrawn++;
                    remainingSecondary--;
                }
            }
        }
        
        // Fill remaining height (horizontal strip) starting from gutter
        if (remainingHeightMm >= secondaryHeightMm && remainingSecondary > 0) {
            const secondaryPerRow = Math.floor(usedWidthMm / secondaryWidthMm);
            
            for (let row = 0; row < Math.floor(remainingHeightMm / secondaryHeightMm) && remainingSecondary > 0; row++) {
                for (let col = 0; col < secondaryPerRow && remainingSecondary > 0; col++) {
                    const x = gutter + (col * secondaryWidth);
                    const y = gutter + usedHeightMm * scale + (row * secondaryHeight);
                    drawMount(canvas, x, y, secondaryWidth, secondaryHeight, mountColor, mount, primaryIsNormal, scale, nestingAnalysis);
                    mountsDrawn++;
                    remainingSecondary--;
                }
            }
        }
    }
    
    return mountsDrawn;
}

function drawMount(canvas, x, y, width, height, color, mount, isRotated, scale, nestingAnalysis = []) {
    const mountVisual = document.createElement('div');
    mountVisual.className = 'mount-visual';
    mountVisual.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${width}px;
        height: ${height}px;
        border-color: ${color};
        background: ${color}15;
        color: ${color};
    `;
    
    // Check if this mount has nested mounts
    const hasNestedMounts = nestingAnalysis.some(n => n.parentMount.id === mount.id);
    
    // Add rotation indicator and dimensions
    const actualWidthMm = width / scale;
    const actualHeightMm = height / scale;
    const label = `M${mount.id}${isRotated ? '↻' : ''}${hasNestedMounts ? '🔸' : ''}`;
    const dimensions = `${actualWidthMm.toFixed(0)}×${actualHeightMm.toFixed(0)}`;
    
    // Adjust font size based on mount size
    const fontSize = Math.max(8, Math.min(12, width / 10));
    const dimFontSize = Math.max(7, fontSize - 2);
    
    mountVisual.innerHTML = `
        <div style="font-weight: bold; font-size: ${fontSize}px;">${label}</div>
        <div style="font-size: ${dimFontSize}px; opacity: 0.8;">${dimensions}</div>
    `;
    
    // Add properly oriented apertures
    if (mount.apertures && mount.apertures.length > 0) {
        mount.apertures.forEach((aperture, apertureIndex) => {
            // Apply rotation to aperture dimensions if mount is rotated
            const apertureWidthMm = isRotated ? aperture.height : aperture.width;
            const apertureHeightMm = isRotated ? aperture.width : aperture.height;
            
            const apertureWidth = apertureWidthMm * scale;
            const apertureHeight = apertureHeightMm * scale;
            
            // Calculate perfect centering, accounting for mount borders (2px each side)
            const mountBorderWidth = 2; // Mount has 2px border
            const apertureBorderWidth = 2; // Aperture has 2px border
            
            // Calculate the inner area of the mount (excluding borders)
            const mountInnerWidth = width - (2 * mountBorderWidth);
            const mountInnerHeight = height - (2 * mountBorderWidth);
            
            // Center the aperture within the inner area
            const apertureX = mountBorderWidth + (mountInnerWidth - apertureWidth) / 2;
            const apertureY = mountBorderWidth + (mountInnerHeight - apertureHeight) / 2;
            
            const apertureVisual = document.createElement('div');
            apertureVisual.className = 'aperture-visual';
            
            // Ensure minimum size for visibility
            const minApertureSize = 8;
            const finalApertureWidth = Math.max(minApertureSize, Math.round(apertureWidth));
            const finalApertureHeight = Math.max(minApertureSize, Math.round(apertureHeight));
            
            // Recalculate position if size was adjusted
            const finalApertureX = mountBorderWidth + (mountInnerWidth - finalApertureWidth) / 2;
            const finalApertureY = mountBorderWidth + (mountInnerHeight - finalApertureHeight) / 2;
            
            // Check if there's a nested mount in this aperture
            const nestingInfo = nestingAnalysis.find(n => 
                n.parentMount.id === mount.id && n.apertureIndex === apertureIndex
            );
            

            
            let apertureBackground = 'rgba(229, 62, 62, 0.3)';
            let apertureBorder = '#e53e3e';
            
            if (nestingInfo) {
                // Show that this aperture contains nested mounts
                apertureBackground = 'rgba(72, 187, 120, 0.3)';
                apertureBorder = '#48bb78';
            }
            
            apertureVisual.style.cssText = `
                position: absolute;
                left: ${Math.round(finalApertureX)}px;
                top: ${Math.round(finalApertureY)}px;
                width: ${finalApertureWidth}px;
                height: ${finalApertureHeight}px;
                border: 2px solid ${apertureBorder};
                background: ${apertureBackground};
                box-sizing: border-box;
                border-radius: 2px;
                box-shadow: inset 0 0 4px rgba(229, 62, 62, 0.5);
            `;
            
            // Draw nested mounts inside aperture if present  
            if (nestingInfo && finalApertureWidth > 15 && finalApertureHeight > 15) {
                // Calculate how many nested mounts fit in this aperture (accounting for aperture gutter)
                const nestedMountWidthMm = nestingInfo.orientation === 'rotated' ? 
                    nestingInfo.nestedMount.outerHeight : nestingInfo.nestedMount.outerWidth;
                const nestedMountHeightMm = nestingInfo.orientation === 'rotated' ? 
                    nestingInfo.nestedMount.outerWidth : nestingInfo.nestedMount.outerHeight;
                
                // Use the available space after gutter from nesting analysis
                const availableWidthMm = nestingInfo.availableWidth;
                const availableHeightMm = nestingInfo.availableHeight;
                
                const nestedMountsAcross = Math.floor(availableWidthMm / nestedMountWidthMm);
                const nestedMountsDown = Math.floor(availableHeightMm / nestedMountHeightMm);
                
                const nestedMountWidth = nestedMountWidthMm * scale;
                const nestedMountHeight = nestedMountHeightMm * scale;
                
                // Draw each nested mount with perfect centering (accounting for aperture gutter)
                const maxNesToShow = Math.min(nestedMountsAcross * nestedMountsDown, 4); // Limit for visual clarity
                let nestsDrawn = 0;
                
                // Calculate total grid size and center it within available space (after gutter)
                const totalGridWidth = nestedMountsAcross * nestedMountWidth;
                const totalGridHeight = nestedMountsDown * nestedMountHeight;
                const gutterOffset = nestingInfo.apertureGutter * scale;
                const availableDisplayWidth = finalApertureWidth - (2 * gutterOffset);
                const availableDisplayHeight = finalApertureHeight - (2 * gutterOffset);
                const gridOffsetX = gutterOffset + (availableDisplayWidth - totalGridWidth) / 2;
                const gridOffsetY = gutterOffset + (availableDisplayHeight - totalGridHeight) / 2;
                
                for (let row = 0; row < nestedMountsDown && nestsDrawn < maxNesToShow; row++) {
                    for (let col = 0; col < nestedMountsAcross && nestsDrawn < maxNesToShow; col++) {
                        const nestedX = gridOffsetX + (col * nestedMountWidth);
                        const nestedY = gridOffsetY + (row * nestedMountHeight);
                        
                        // Ensure minimum size for visibility
                        const minNestedSize = 8;
                        const displayWidth = Math.max(minNestedSize, Math.round(nestedMountWidth));
                        const displayHeight = Math.max(minNestedSize, Math.round(nestedMountHeight));
                        
                        // Adjust position if size was changed
                        const adjustedX = nestedX + (nestedMountWidth - displayWidth) / 2;
                        const adjustedY = nestedY + (nestedMountHeight - displayHeight) / 2;
                        
                        const nestedMountVisual = document.createElement('div');
                        nestedMountVisual.style.cssText = `
                            position: absolute;
                            left: ${Math.round(adjustedX)}px;
                            top: ${Math.round(adjustedY)}px;
                            width: ${displayWidth}px;
                            height: ${displayHeight}px;
                            border: 1px solid #2d5016;
                            background: rgba(72, 187, 120, 0.8);
                            box-sizing: border-box;
                            border-radius: 2px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: ${Math.max(6, Math.min(10, displayWidth / 6))}px;
                            color: #1a202c;
                            font-weight: bold;
                            line-height: 1;
                        `;
                        nestedMountVisual.textContent = `M${nestingInfo.nestedMount.id}${nestingInfo.orientation === 'rotated' ? '↻' : ''}`;
                        apertureVisual.appendChild(nestedMountVisual);
                        nestsDrawn++;
                    }
                }
                
                // Add indicator if there are more nested mounts than shown
                if (nestedMountsAcross * nestedMountsDown > maxNesToShow) {
                    const moreIndicator = document.createElement('div');
                    moreIndicator.style.cssText = `
                        position: absolute;
                        bottom: 2px;
                        right: 2px;
                        font-size: 8px;
                        color: #2d5016;
                        font-weight: bold;
                    `;
                    moreIndicator.textContent = `+${(nestedMountsAcross * nestedMountsDown) - maxNesToShow}`;
                    apertureVisual.appendChild(moreIndicator);
                }
            } else if (finalApertureWidth > 20 && finalApertureHeight > 20) {
                // Add aperture label for better identification when no nesting
                const apertureLabel = document.createElement('div');
                apertureLabel.style.cssText = `
                    font-size: ${Math.max(6, Math.min(8, finalApertureWidth / 6))}px;
                    color: ${nestingInfo ? '#2d5016' : '#c53030'};
                    font-weight: bold;
                    text-align: center;
                    line-height: 1;
                    pointer-events: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                `;
                apertureLabel.textContent = nestingInfo ? `M${nestingInfo.nestedMount.id}` : 'A';
                apertureVisual.appendChild(apertureLabel);
            }
            
            mountVisual.appendChild(apertureVisual);
        });
    }
    
    canvas.appendChild(mountVisual);
}



function getStrategyDescription(strategy) {
    switch(strategy) {
        case 'normal-first':
            return 'Fill normal, then rotated in gaps';
        case 'rotated-first':
            return 'Fill rotated, then normal in gaps';
        case 'alternating-rows':
            return 'Alternating rows of different orientations';
        case 'column-mixed-rotated-first':
            return 'Rotated columns first, then normal columns';
        case 'column-mixed-normal-first':
            return 'Normal columns first, then rotated columns';
        default:
            return strategy;
    }
}

function displayBreakdown(results) {
    const breakdown = document.getElementById('breakdown');
    breakdown.innerHTML = '';
    
    results.forEach(result => {
        const breakdownItem = document.createElement('div');
        breakdownItem.className = 'breakdown-item';
        breakdownItem.style.cssText = `
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            border-left: 4px solid ${result.isMixed ? '#9f7aea' : result.isRotated ? '#ed8936' : '#48bb78'};
        `;
        
        const mountInfo = document.createElement('div');
        mountInfo.className = 'mount-info';
        mountInfo.style.cssText = `
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 5px;
        `;
        
        // Calculate dimensions for display
        const displayWidth = result.isRotated ? result.mount.outerHeight : result.mount.outerWidth;
        const displayHeight = result.isRotated ? result.mount.outerWidth : result.mount.outerHeight;
        
        mountInfo.innerHTML = `
            <div>Mount ${result.mount.id}: ${result.mount.outerWidth.toFixed(1)}×${result.mount.outerHeight.toFixed(1)}mm</div>
            <div style="font-size: 0.9em; color: #4a5568;">
                ${result.isMixed ? 
                    `<strong>◐ MIXED ORIENTATIONS</strong> for optimal packing (${result.mixedDetails.strategy})` :
                    result.isRotated ? 
                        `<strong>↻ ROTATED</strong> to ${displayWidth.toFixed(1)}×${displayHeight.toFixed(1)}mm for better yield` : 
                        'Normal orientation (no rotation needed)'
                }
            </div>
        `;
        
        const yieldComparison = document.createElement('div');
        yieldComparison.className = 'yield-comparison';
        yieldComparison.style.cssText = `
            font-size: 0.85em;
            color: #4a5568;
            margin: 8px 0;
        `;
        
        if (result.isMixed) {
            const strategyDescription = getStrategyDescription(result.mixedDetails.strategy);
            yieldComparison.innerHTML = `
                <div>Normal orientation: ${result.normalYield} per sheet</div>
                <div>Rotated orientation: ${result.rotatedYield} per sheet</div>
                <div style="padding: 8px; background: #f0f8ff; border-radius: 4px; margin: 5px 0;">
                    <strong>Mixed orientation: ${result.mixedDetails.totalYield} per sheet</strong><br>
                    <span style="font-size: 0.9em;">
                        ${result.mixedDetails.normalCount} normal + ${result.mixedDetails.rotatedCount} rotated
                        (${strategyDescription})
                    </span>
                </div>
                <div style="font-weight: 600; color: #2d3748;">
                    Best yield: ${result.bestYield} per sheet (mixed orientations)
                </div>
            `;
        } else {
            yieldComparison.innerHTML = `
                <div>Normal orientation: ${result.normalYield} per sheet</div>
                <div>Rotated orientation: ${result.rotatedYield} per sheet</div>
                <div style="font-weight: 600; color: #2d3748;">
                    Best yield: ${result.bestYield} per sheet (${result.approach})
                </div>
            `;
        }
        
        const mountCount = document.createElement('div');
        mountCount.className = 'mount-count';
        mountCount.style.cssText = `
            font-size: 0.9em;
            color: #4a5568;
        `;
        
        const sheetsNeeded = Math.ceil(result.mount.quantity / result.bestYield);
        const efficiency = ((result.mount.quantity / (sheetsNeeded * result.bestYield)) * 100).toFixed(1);
        
        mountCount.innerHTML = `
            <div><strong>${result.mount.quantity}</strong> required → <strong>${sheetsNeeded}</strong> sheets needed</div>
            <div>Efficiency: ${efficiency}% (${result.mount.quantity} used out of ${sheetsNeeded * result.bestYield} possible)</div>
        `;
        
        // Add aperture info if present
        if (result.mount.apertures && result.mount.apertures.length > 0) {
            const apertureInfo = document.createElement('div');
            apertureInfo.style.cssText = `
                font-size: 0.85em;
                color: #e53e3e;
                margin-top: 8px;
                padding: 5px;
                background: rgba(229, 62, 62, 0.1);
                border-radius: 4px;
            `;
            apertureInfo.innerHTML = `
                <strong>Aperture:</strong> ${result.mount.apertures[0].width.toFixed(1)}×${result.mount.apertures[0].height.toFixed(1)}mm
            `;
            breakdownItem.appendChild(apertureInfo);
        }
        
        // Add nesting info if present
        if (result.nestingInfo) {
            const nestingInfo = document.createElement('div');
            nestingInfo.style.cssText = `
                font-size: 0.85em;
                color: #48bb78;
                margin-top: 8px;
                padding: 8px;
                background: rgba(72, 187, 120, 0.1);
                border-radius: 4px;
                border-left: 3px solid #48bb78;
            `;
            const nestedCount = Math.min(result.nestingInfo.nestedMount.quantity, result.nestingInfo.totalNestingCapacity);
            const aperture = result.nestingInfo.aperture;
            const availableSpace = `${result.nestingInfo.availableWidth.toFixed(1)}×${result.nestingInfo.availableHeight.toFixed(1)}mm`;
            const gutterUsed = result.nestingInfo.apertureGutter;
            
            nestingInfo.innerHTML = `
                <strong>🔸 NESTED MOUNT:</strong> This mount (${result.mount.outerWidth.toFixed(1)}×${result.mount.outerHeight.toFixed(1)}mm) 
                can be cut from Mount #${result.nestingInfo.parentMount.id}'s aperture waste material<br>
                <div style="margin-top: 4px; font-size: 0.9em; color: #2d5016;">
                    <strong>Aperture Details:</strong> ${aperture.width.toFixed(1)}×${aperture.height.toFixed(1)}mm aperture 
                    → ${availableSpace} usable space (after ${gutterUsed.toFixed(1)}mm gutter)
                </div>
                <em>Up to ${nestedCount} pieces can be nested per sheet (${result.nestingInfo.orientation} orientation)</em>
            `;
            breakdownItem.appendChild(nestingInfo);
        }
        
        breakdownItem.appendChild(mountInfo);
        breakdownItem.appendChild(yieldComparison);
        breakdownItem.appendChild(mountCount);
        breakdown.appendChild(breakdownItem);
    });
}

function displayPackingAnalysis(results, sheet) {
    const packingAnalysis = document.getElementById('packingAnalysis');
    packingAnalysis.innerHTML = '';
    
    const availableWidth = sheet.width - (2 * sheet.outerGutter);
    const availableHeight = sheet.height - (2 * sheet.outerGutter);
    const totalAvailableArea = availableWidth * availableHeight;
    
    // Create overall summary
    const summaryDiv = document.createElement('div');
    summaryDiv.style.cssText = `
        background: #e6f3ff;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
        border-left: 4px solid #667eea;
    `;
    
    let totalMountArea = 0;
    let totalRotatedMounts = 0;
    let totalMixedMounts = 0;
    
    results.forEach(result => {
        const mountArea = result.mount.outerWidth * result.mount.outerHeight;
        totalMountArea += mountArea * result.mount.quantity;
        if (result.isMixed) totalMixedMounts++;
        else if (result.isRotated) totalRotatedMounts++;
    });
    
    const utilizationPercent = ((totalMountArea / totalAvailableArea) * 100).toFixed(1);
    
    summaryDiv.innerHTML = `
        <h4 style="margin: 0 0 10px 0; color: #2d3748;">Sheet Utilization Summary</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            <div><strong>Available Area:</strong> ${(totalAvailableArea / 1000).toFixed(1)} cm²</div>
            <div><strong>Used Area:</strong> ${(totalMountArea / 1000).toFixed(1)} cm²</div>
            <div><strong>Utilization:</strong> ${utilizationPercent}%</div>
            <div><strong>Optimization:</strong> ${totalMixedMounts} mixed, ${totalRotatedMounts} rotated, ${results.length - totalMixedMounts - totalRotatedMounts} normal</div>
        </div>
    `;
    packingAnalysis.appendChild(summaryDiv);
    
    // Create detailed packing grid for each mount type
    results.forEach(result => {
        const packingDiv = document.createElement('div');
        packingDiv.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        `;
        
        const mountWidthMm = result.isRotated ? result.mount.outerHeight : result.mount.outerWidth;
        const mountHeightMm = result.isRotated ? result.mount.outerWidth : result.mount.outerHeight;
        
        const mountsPerRow = Math.floor(availableWidth / mountWidthMm);
        const mountsPerColumn = Math.floor(availableHeight / mountHeightMm);
        const actualMountsPerSheet = Math.min(mountsPerRow * mountsPerColumn, result.bestYield);
        
        // Calculate spacing/waste
        const usedWidth = mountsPerRow * mountWidthMm;
        const usedHeight = mountsPerColumn * mountHeightMm;
        const wasteWidth = availableWidth - usedWidth;
        const wasteHeight = availableHeight - usedHeight;
        
        if (result.isMixed) {
            const strategyDescription = getStrategyDescription(result.mixedDetails.strategy);
            const improvement = result.bestYield - Math.max(result.normalYield, result.rotatedYield);
            const improvementPercent = ((improvement / Math.max(result.normalYield, result.rotatedYield)) * 100).toFixed(1);
            
            let strategyDetails = '';
            if (result.mixedDetails.strategy === 'column-mixed-rotated-first' || result.mixedDetails.strategy === 'column-mixed-normal-first') {
                const rotatedCols = result.mixedDetails.rotatedColumns || 0;
                const normalCols = result.mixedDetails.normalColumns || 0;
                strategyDetails = `
                    <div style="background: #f0f8ff; padding: 10px; border-radius: 4px; margin: 10px 0; font-size: 0.9em;">
                        <strong>Column Arrangement:</strong><br>
                        ${rotatedCols} columns rotated (${result.mixedDetails.rotatedCount} mounts) + 
                        ${normalCols} columns normal (${result.mixedDetails.normalCount} mounts)
                    </div>
                `;
            }
            
            packingDiv.innerHTML = `
                <h4 style="margin: 0 0 10px 0; color: #2d3748;">
                    Mount ${result.mount.id} Packing Details
                    <span style="color: #9f7aea;">◐ MIXED ORIENTATIONS</span>
                </h4>
                <div style="background: #f8f9ff; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <h5 style="margin: 0 0 8px 0; color: #4a5568;">Mixed Orientation Strategy: ${strategyDescription}</h5>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 0.9em; color: #4a5568;">
                        <div>
                            <strong>${result.mixedDetails.normalCount}</strong> normal orientation<br>
                            <em>${result.mount.outerWidth.toFixed(1)}×${result.mount.outerHeight.toFixed(1)}mm</em>
                        </div>
                        <div>
                            <strong>${result.mixedDetails.rotatedCount}</strong> rotated orientation<br>
                            <em>${result.mount.outerHeight.toFixed(1)}×${result.mount.outerWidth.toFixed(1)}mm</em>
                        </div>
                    </div>
                    ${strategyDetails}
                </div>
                
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                    <h5 style="margin: 0 0 8px 0; color: #4a5568;">Yield Comparison</h5>
                    <div style="display: flex; gap: 15px; font-size: 0.9em;">
                        <div style="padding: 8px; background: #f7fafc; border-radius: 4px;">
                            <strong>Normal:</strong> ${result.normalYield} per sheet
                        </div>
                        <div style="padding: 8px; background: #f7fafc; border-radius: 4px;">
                            <strong>Rotated:</strong> ${result.rotatedYield} per sheet
                        </div>
                        <div style="padding: 8px; background: #f0f8ff; border-radius: 4px; font-weight: 600; color: #2d3748; border: 2px solid #9f7aea;">
                            <strong>Mixed:</strong> ${result.bestYield} per sheet
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 15px; padding: 10px; background: #e6f3ff; border-radius: 4px; font-size: 0.9em; color: #4a5568;">
                    <strong>Improvement:</strong> Mixed orientation yields ${improvement} more mounts per sheet than single orientation (+${improvementPercent}% improvement)!
                </div>
            `;
        } else {
            packingDiv.innerHTML = `
                <h4 style="margin: 0 0 10px 0; color: #2d3748;">
                    Mount ${result.mount.id} Packing Details
                    ${result.isRotated ? '<span style="color: #ed8936;">↻ ROTATED</span>' : ''}
                </h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h5 style="margin: 0 0 8px 0; color: #4a5568;">Arrangement</h5>
                        <div style="font-size: 0.9em; color: #4a5568;">
                            <div><strong>${mountsPerRow}</strong> mounts per row</div>
                            <div><strong>${mountsPerColumn}</strong> rows per sheet</div>
                            <div><strong>${actualMountsPerSheet}</strong> total per sheet</div>
                            <div style="margin-top: 8px;">
                                <strong>Dimensions:</strong> ${mountWidthMm.toFixed(1)}×${mountHeightMm.toFixed(1)}mm
                                ${result.isRotated ? `<br><em>(rotated from ${result.mount.outerWidth.toFixed(1)}×${result.mount.outerHeight.toFixed(1)}mm)</em>` : ''}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h5 style="margin: 0 0 8px 0; color: #4a5568;">Space Utilization</h5>
                        <div style="font-size: 0.9em; color: #4a5568;">
                            <div><strong>Used Width:</strong> ${usedWidth.toFixed(1)}mm (${(usedWidth/availableWidth*100).toFixed(1)}%)</div>
                            <div><strong>Used Height:</strong> ${usedHeight.toFixed(1)}mm (${(usedHeight/availableHeight*100).toFixed(1)}%)</div>
                            <div><strong>Waste Width:</strong> ${wasteWidth.toFixed(1)}mm</div>
                            <div><strong>Waste Height:</strong> ${wasteHeight.toFixed(1)}mm</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                    <h5 style="margin: 0 0 8px 0; color: #4a5568;">Yield Comparison</h5>
                    <div style="display: flex; gap: 15px; font-size: 0.9em;">
                        <div style="padding: 8px; background: ${result.isRotated ? '#f7fafc' : '#e6fffa'}; border-radius: 4px; ${result.isRotated ? '' : 'border: 2px solid #48bb78;'}">
                            <strong>Normal:</strong> ${result.normalYield} per sheet
                        </div>
                        <div style="padding: 8px; background: ${result.isRotated ? '#fff5f1' : '#f7fafc'}; border-radius: 4px; ${result.isRotated ? 'border: 2px solid #ed8936;' : ''}">
                            <strong>Rotated:</strong> ${result.rotatedYield} per sheet
                        </div>
                        <div style="padding: 8px; background: #f0f8ff; border-radius: 4px; font-weight: 600; color: #2d3748;">
                            <strong>Best:</strong> ${result.bestYield} per sheet
                        </div>
                    </div>
                </div>
            `;
        }
        
        packingAnalysis.appendChild(packingDiv);
    });
} 