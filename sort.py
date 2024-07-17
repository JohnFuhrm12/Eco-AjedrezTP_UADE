# Bubble sort
list = [3, 5, 9, 2, 7, 9, 43, 72, 4]

for i in range(len(list)):
    for k in range(i + 1, len(list)):
        if list[i] > list[k]:
            temp = list[i]
            list[i] = list[k]
            list[k] = temp

print(list)

# Binary search
val = 43
found = False
pos = None
l = 0
r = len(list) - 1

while found == False and l <= r:
    mid = (l + r) // 2
    newVal = list[mid]
    if newVal == val:
        pos = mid
        found = True
    elif newVal < val:
       l = mid
    elif newVal > val:
        r = mid

print(pos)

# Selection Sort
listS = [3, 5, 9, 2, 7, 9, 43, 72, 4]

for i in range(len(listS)):
    min_index = i
    for j in range(i + 1, len(listS)):
        if listS[j] < listS[min_index]:
            min_index = j

    temp = listS[i]

    listS[i] = listS[min_index]
    listS[min_index] = temp

print(listS)

# Insertion Sort
arr = [3, 5, 9, 2, 7, 9, 43, 72, 4]

for i in range(1, len(arr)):
    key = arr[i]
    j = i-1
    while j >= 0 and key < arr[j] :
            arr[j + 1] = arr[j]
            j -= 1
    arr[j + 1] = key

print(arr)