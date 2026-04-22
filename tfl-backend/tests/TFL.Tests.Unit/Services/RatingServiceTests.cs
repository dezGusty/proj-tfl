using TFL.Application.Services;

namespace TFL.Tests.Unit.Services;

public class RatingServiceTests
{
    // § 12.2 RatingService Tests

    [Fact]
    public void CalculateAdjustment_Draw_ReturnsFixed()
    {
        // 0-0 draw: diff = 0 => 0.05 + 0 * 0.011 = 0.05
        var adjustment = RatingService.CalculateAdjustment(0, 0);
        Assert.Equal(0.05, adjustment, precision: 4);
    }

    [Fact]
    public void CalculateAdjustment_OneGoalDiff_ReturnsCorrectValue()
    {
        // |3-2| = 1 => 0.05 + 1 * 0.011 = 0.061
        var adjustment = RatingService.CalculateAdjustment(3, 2);
        Assert.Equal(0.061, adjustment, precision: 4);
    }

    [Fact]
    public void CalculateAdjustment_FiveGoalDiff_ReturnsCorrectValue()
    {
        // |5-0| = 5 => 0.05 + 5 * 0.011 = 0.105
        var adjustment = RatingService.CalculateAdjustment(5, 0);
        Assert.Equal(0.105, adjustment, precision: 4);
    }

    [Fact]
    public void CalculateAdjustment_SymmetricInputs_ReturnsSameValue()
    {
        var a = RatingService.CalculateAdjustment(4, 1);
        var b = RatingService.CalculateAdjustment(1, 4);
        Assert.Equal(a, b, precision: 6);
    }

    [Fact]
    public void CalculateAdjustment_LargeGoalDiff_IsLinear()
    {
        // 10-0 => 0.05 + 10 * 0.011 = 0.16
        var adjustment = RatingService.CalculateAdjustment(10, 0);
        Assert.Equal(0.16, adjustment, precision: 4);
    }

    [Fact]
    public void CalculateAdjustment_TwoGoalDiff_IsCorrect()
    {
        // 0.05 + 2 * 0.011 = 0.072
        var adjustment = RatingService.CalculateAdjustment(4, 2);
        Assert.Equal(0.072, adjustment, precision: 4);
    }

    [Fact]
    public void CalculateAdjustment_ThreeGoalDiff_IsCorrect()
    {
        // 0.05 + 3 * 0.011 = 0.083
        var adjustment = RatingService.CalculateAdjustment(3, 0);
        Assert.Equal(0.083, adjustment, precision: 4);
    }

    [Fact]
    public void CalculateAdjustment_AlwaysPositive()
    {
        var adjustment = RatingService.CalculateAdjustment(0, 5);
        Assert.True(adjustment > 0);
    }

    [Fact]
    public void CalculateAdjustment_ScaledByGoalMultiplier()
    {
        // Each extra goal should add exactly 0.011
        var diff0 = RatingService.CalculateAdjustment(1, 1);
        var diff1 = RatingService.CalculateAdjustment(2, 1);
        Assert.Equal(0.011, diff1 - diff0, precision: 6);
    }
}
