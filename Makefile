CC := gcc
CFLAGS := -Wall -Werror -fPIC
DEPFLAGS = -MMD -MP

SRC_DIR := sources
LIB_DIR := .

SRCS := $(wildcard $(SRC_DIR)/*.c)
OBJS := $(patsubst $(SRC_DIR)/%.c,%.o,$(SRCS))
DEPS := $(patsubst %.o,%.d,$(OBJS))

LIB_NAME := libturbo

ifeq ($(shell uname),Darwin)
	LIB_EXT := dylib
	LIB_LDFLAGS := -dynamiclib
else
	LIB_EXT := so
	LIB_LDFLAGS := -shared
endif

.PHONY: all
all: $(LIB_DIR)/$(LIB_NAME).$(LIB_EXT)

%.o: $(SRC_DIR)/%.c
	$(CC) $(CFLAGS) $(DEPFLAGS) -c $< -o $@

-include $(DEPS)

$(LIB_DIR)/$(LIB_NAME).$(LIB_EXT): $(OBJS)
	$(CC) $(CFLAGS) $(LIB_LDFLAGS) $^ -o $@

.PHONY: clean
clean:
	@rm -f $(OBJS) $(DEPS) $(LIB_DIR)/$(LIB_NAME).$(LIB_EXT)
